'use strict';

/**
 * @constant {string} APP_INIT - Event triggered when the application is initialized.
 */
const APP_INIT = "APP_INIT";

/**
 * @constant {string} APP_ATTACHED - Event triggered when the application is attached to the DOM.
 */
const APP_ATTACHED = "APP_ATTACHED";

/**
 * @constant {string} APP_DESTROYED - Event triggered when the application is destroyed.
 */
const APP_DESTROYED = "APP_DESTROYED";

/**
 * @constant {string} COMPONENT_INIT - Event triggered when a component is initialized.
 */
const COMPONENT_INIT = "COMPONENT_INIT";

/**
 * @constant {string} COMPONENT_ATTACHED - Event triggered when a component is attached to the DOM.
 */
const COMPONENT_ATTACHED = "COMPONENT_ATTACHED";

/**
 * @constant {string} COMPONENT_DESTROYED - Event triggered when a component is destroyed.
 */
const COMPONENT_DESTROYED = "COMPONENT_DESTROYED";

/**
 * @constant {string} COMPONENT_UPDATED - Event triggered when a component is updated.
 */
const COMPONENT_UPDATED = "COMPONENT_UPDATED";

/**
 * @constant {string} COMPONENT_RENDERED - Event triggered when a component is rendered.
 */
const COMPONENT_RENDERED = "COMPONENT_RENDERED";

var events = /*#__PURE__*/Object.freeze({
  __proto__: null,
  APP_ATTACHED: APP_ATTACHED,
  APP_DESTROYED: APP_DESTROYED,
  APP_INIT: APP_INIT,
  COMPONENT_ATTACHED: COMPONENT_ATTACHED,
  COMPONENT_DESTROYED: COMPONENT_DESTROYED,
  COMPONENT_INIT: COMPONENT_INIT,
  COMPONENT_RENDERED: COMPONENT_RENDERED,
  COMPONENT_UPDATED: COMPONENT_UPDATED
});

/**
 * Initializes the event listener for Turtle development events.
 * This function listens for the "turtledev" custom event and processes 
 * the details according to the event type.
 */
async function initListener() {
  window.addEventListener("turtledev", function(event) {
    let details = event.detail;
    let eventName = details.name;
    let data = details.data;
    let ID = (Math.floor(Math.random() * 99999999) * Date.now()).toString(32);

    switch (eventName) {
      case APP_INIT:
        if (!data._turtle_dev_id) {
          data._turtle_dev_id = ID;
          data._turtle_dev_data = {
            type: "app",
            verify: true,
            status: "init",
            target: data
          };
        }
        window.__TURTLE_DEV__.apps[data._turtle_dev_id] = data;
        break;

      case COMPONENT_INIT:
        if (!data._turtle_dev_id) {
          data._turtle_dev_id = ID;
          data._turtle_dev_data = {
            type: "component",
            verify: true,
            status: "init",
            target: data
          };
        }
        window.__TURTLE_DEV__.components[data._turtle_dev_id] = data;
        break;
        // Uncomment to throw an error for unknown dev events
        // throw "[Turtle Dev Error] Unknown dev event!";
    }
  });
}

/**
 * Initializes the Turtle Development Mode.
 * 
 * This function checks if the development mode is enabled in the Turtle framework.
 * If so, it sets up logging for development tools, initializes tracking for apps and components,
 * and activates additional debugging features.
 */
function initDevMode() {
  if (window.__TURTLE__.dev) {
    console.info("Turtle Development Mode is activated !");
    console.info("In development mode, you can access additional debugging tools and features.");

    // Initialize the development tracking object
    window.__TURTLE_DEV__ = {
      apps: {},
      components: {},
    };

    console.info("Tracking initialized. Use window.__TURTLE_DEV__.apps and window.__TURTLE_DEV__.components to monitor your applications and components.");

    // Initialize event listeners for debugging
    initListener();
  }
}

/**
 * Emits a development event for the Turtle framework.
 *
 * This function creates and dispatches a custom event named "turtledev" 
 * if the development mode is activated. The event includes the specified 
 * event name and associated data as its detail.
 *
 * @param {string} name - The name of the event to emit.
 * @param {*} data - The data associated with the event.
 */
function emitDevEvent(name, data) {
  if (!window.__TURTLE__.dev) return;

  window.dispatchEvent(new CustomEvent("turtledev", {
    detail: {
      name,
      data
    }
  }));
}

/**
 * Custom element that represents a Turtle component in the DOM.
 * Extends HTMLElement to manage lifecycle and interaction with the Turtle component.
 */
class TurtleComponentElement extends HTMLElement {
  /**
   * Creates an instance of TurtleComponentElement.
   */
  constructor() {
    super();
    this.app = null; // The Turtle application instance.
    this.component = null; // The Turtle component instance.
  }

  /**
   * Attaches a Turtle application and component to this custom element.
   * @param {Object} app - The Turtle application instance.
   * @param {Object} parent - The parent component or context of this component.
   * @param {TurtleComponent} component - The Turtle component instance.
   */
  attach(app, parent, component) {
    this.app = app;
    this.component = component;
    this.component.parent = parent;
    this.component.contexts.parent = parent;
    this.component.element = this;
    this.component.app = app;
    emitDevEvent(COMPONENT_ATTACHED, component);
  }

  /**
   * Lifecycle method called when the element is inserted into the DOM.
   * Initializes and starts the attached component.
   */
  connectedCallback() {
    this.component.onInit();
    this.component.start();
    this.component.onCreate();
    this.component.startRender();
  }

  /**
   * Lifecycle method called when the element is removed from the DOM.
   * Can be used for cleanup operations if needed.
   */
  disconnectedCallback() {
    this.component.onDestroy();
    // Add any cleanup code here if necessary
  }
}

// Define the custom element "turtle-component" with the TurtleComponentElement class.
window.customElements.define("turtle-component", TurtleComponentElement);

/**
 * Represents the rendering Data for Turtle components.
 * This class manages references, bindings, and events for rendering.
 */
class TurtleRenderData {
  /**
   * Creates an instance of TurtleRenderData.
   * 
   * @param {DocumentFragment} [root] - The root element for rendering. Defaults to a new DocumentFragment.
   */
  constructor(root) {
    this.root = root ?? document.createDocumentFragment();
    this.refs = {};
    this.bindings = {};
    this.events = {};
  }

  /**
   * Adds a binding for a specific state.
   * 
   * @param {string} state - The name of the state to bind.
   * @param {Object} configs - Configuration object for the binding, which may include callback functions or parameters.
   */
  addBinding(state, configs) {
    if (!this.bindings[state]) {
      this.bindings[state] = [];
    }
    this.bindings[state].push(configs);
  }

  /**
   * Adds a reference to a DOM element with a unique name.
   * 
   * @param {string} name - The unique name for the reference.
   * @param {HTMLElement} element - The DOM element to be referenced.
   * @throws {Error} Throws an error if a reference with the same name already exists.
   * @private
   */
  addRef(name, element) {
    if (this.refs[name]) {
      throw new Error(`[Turtle Render Error] Multiple elements are assigned the same ref, which is not allowed. Each ref must be unique to a single DOM element.`);
    }

    this.refs[name] = element;
  }

  /**
   * Retrieves a referenced DOM element by its unique name.
   * 
   * @param {string} name - The unique name for the reference.
   * @returns {HTMLElement} - The referenced DOM element.
   * @throws {Error} Throws an error if no reference with the given name exists.
   */
  getRef(name) {
    const ref = this.refs[name];
    if (!ref) {
      throw new Error(`[Turtle Render Error] No ref found with the name: ${name}`);
    }
    return ref;
  }

  /**
   * Removes a reference by its unique name.
   * 
   * @param {string} name - The unique name for the reference to remove.
   * @throws {Error} Throws an error if no reference with the given name exists.
   */
  removeRef(name) {
    if (!this.refs[name]) {
      throw new Error(`[Turtle Render Error] Cannot remove ref: No ref found with the name: ${name}`);
    }
    delete this.refs[name];
  }
}

/**
 * Parses a string of HTML content and wraps it in a root element.
 * 
 * @param {string} content - The HTML content to parse.
 * @returns {Element|null} - Returns the root element if parsing is successful, or null if there is a parsing error.
 * @throws {Error} Throws an error if there is a parsing issue with detailed information.
 */
function parseHTML(content) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(`<root>${content}</root>`, "text/xml");
  let parserError = doc.getElementsByTagName("parsererror");

  if (parserError.length > 0) {
    const errorMessage = "Rendering error: " + parserError[0].textContent;
    console.log(errorMessage);
    throw new Error(errorMessage);
  } else {
    return doc.getElementsByTagName("root")[0];
  }
}

/**
 * Represents an event directive for adding event listeners to a target element.
 */
class EventDirective {
  /**
   * Creates an instance of EventDirective.
   * 
   * @param {HTMLElement} target - The target element to attach the event listener to.
   * @param {string} name - The name of the event to listen for.
   * @param {string} value - The name of the method to call on the event.
   * @param {Object} context - The context in which the event method is defined.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the event directive by adding the event listener to the target element.
   */
  apply() {
    if (this.context.root[this.value]) {
      this.target.addEventListener(this.name, this.context.root[this.value].bind(this.context.root));
    }
  }
}

/**
 * Represents a binding directive for binding attributes to a target element.
 */
class BindingDirective {
  /**
   * Creates an instance of BindingDirective.
   * 
   * @param {HTMLElement} target - The target element to bind the attribute to.
   * @param {string} name - The name of the attribute to bind.
   * @param {string} value - The state name to bind to the attribute.
   * @param {Object} context - The context for the binding.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the binding directive by adding a binding for the attribute to the target element.
   */
  apply() {
    this.context.addBinding(this.value, {
      type: "attribute",
      name: this.name,
      state: this.value,
      target: this.target
    });
  }
}

/**
 * Represents an HTML directive for binding innerHTML to a target element.
 */
class HTMLDirective {
  /**
   * Creates an instance of HTMLDirective.
   * 
   * @param {HTMLElement} target - The target element to bind innerHTML to.
   * @param {string} name - The name of the property (always 'innerHTML').
   * @param {string} value - The state name to bind to innerHTML.
   * @param {Object} context - The context for the binding.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the HTML directive by adding a binding for innerHTML to the target element.
   */
  apply() {
    this.context.addBinding(this.value, {
      type: "property",
      name: "innerHTML",
      state: this.value,
      target: this.target
    });
  }
}

/**
 * Represents a text content directive for binding textContent to a target element.
 */
class TextContentDirective {
  /**
   * Creates an instance of TextContentDirective.
   * 
   * @param {HTMLElement} target - The target element to bind textContent to.
   * @param {string} name - The name of the property (always 'textContent').
   * @param {string} value - The state name to bind to textContent.
   * @param {Object} context - The context for the binding.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the text content directive by adding a binding for textContent to the target element.
   */
  apply() {
    this.context.addBinding(this.value, {
      type: "property",
      name: "textContent",
      state: this.value,
      target: this.target
    });
  }
}

/**
 * Represents a reference directive for adding a reference to a DOM element.
 */
class RefDirective {
  /**
   * Creates an instance of RefDirective.
   * 
   * @param {HTMLElement} target - The target element to be referenced.
   * @param {string} name - The name of the reference.
   * @param {string} value - The unique name to assign to the reference.
   * @param {Object} context - The context for managing references.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the reference directive by adding a reference to the target element.
   */
  apply() {
    this.context.addRef(this.value, this.target);
  }
}

/**
 * Represents a reference to the element associated with a Turtle component.
 */
class TurtleComponentRef {
  #element;

  /**
   * Creates an instance of TurtleComponentRef.
   * @param {HTMLElement} element - The HTML element associated with the Turtle component.
   */
  constructor(element) {
    if (!element) {
      throw new Error('[Turtle Component Ref Error] An element must be provided.');
    }
    this.#element = element;
  }

  /**
   * Gets the forward references of the component associated with the element.
   * @returns {Object} The forward references of the component.
   * @throws {Error} If the element does not have an associated component.
   */
  get component() {
    if (!this.#element.component) {
      throw new Error('[Turtle Component Ref Error] The element does not have an associated component.');
    }
    return this.#element.component.forwardRefs;
  }

  // You can add more methods here to interact with the component or element.
}

/**
 * Extracts the name from the directive based on the given prefix.
 *
 * @param {string} name - The name of the directive.
 * @param {string} start - The prefix to extract from the name.
 * @returns {string|null} The extracted name without the prefix, or null if the prefix is not found.
 */
function extractName(name, start) {
  if (name.startsWith(start)) return name.substring(start.length);
  return null;
}

/**
 * Applies a directive based on its name and value to a target element.
 *
 * @param {HTMLElement} target - The target element to which the directive is applied.
 * @param {string} name - The name of the directive.
 * @param {string} value - The value associated with the directive.
 * @param {Object} context - The context in which the directive is applied.
 * @returns {boolean} Returns true if the directive was successfully applied, otherwise false.
 */
function applyDirective(target, name, value, context) {
  let passed = false;
  for (let prefix in directives) {
    const ename = extractName(name, prefix);
    const DirectiveClass = directives[ename != null ? prefix : name];
    if (!DirectiveClass) {
      continue;
    }
    const directiveInstance = new DirectiveClass(target, ename, value, context);
    if (typeof directiveInstance.apply === 'function') {
      directiveInstance.apply();
      passed = true;
    }
    break;
  }
  return passed;
}

// Map of directive prefixes to their corresponding classes
const directives = {
  "tevent-": EventDirective,
  "tbind-": BindingDirective,
  "thtml": HTMLDirective,
  "ttext": TextContentDirective,
  "ref": RefDirective
};

/**
 * Processes attributes of a given node and applies directives accordingly.
 *
 * @param {HTMLElement} target - The target element to process attributes for.
 * @param {Element} node - The node from which to extract attributes.
 * @param {Object} context - The context in which the attributes are processed.
 * @param {Object} data - Additional data to be used during processing.
 */
function processAttribute(target, node, context, data) {
  for (let attribute of Array.from(node.attributes)) {
    let name = attribute.name;
    let value = attribute.value;
    let isDirective = applyDirective(target, name, value, context);
    if (!isDirective) {
      target.setAttribute(name, value);
    }
  }
}

/**
 * Processes a DOM tree, creating elements and applying directives as needed.
 *
 * @param {HTMLElement} element - The parent element to which new elements are appended.
 * @param {Node} tree - The DOM tree to process.
 * @param {Object} context - The context for processing.
 * @param {Object} data - Additional data, including component mappings.
 * @param {Object} app - The application context for components.
 */
function process(element, tree, context, data, app) {
  for (let node of Array.from(tree.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      element.appendChild(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (data.components[node.nodeName]) {
        let component = data.components[node.nodeName];
        let componentElement = document.createElement("turtle-component");
        componentElement.attach(app, context.root, component);
        if (node.getAttribute("ref")) {
          context.addRef(
            node.getAttribute("ref"),
            new TurtleComponentRef(componentElement)
          );
        }
        element.appendChild(componentElement);
      } else {
        let newElement = document.createElement(node.tagName);
        processAttribute(newElement, node, context);
        if (node.childNodes.length > 0) process(newElement, node, context, data);
        element.appendChild(newElement);
      }
    }
  }
}

/**
 * Renders a template by processing its raw HTML and inserting values into it.
 *
 * @param {HTMLElement} element - The parent element to which the rendered content will be appended.
 * @param {TemplateStringsArray} template - The template containing the raw HTML and associated values.
 * @param {TurtleRenderData} [context=new TurtleRenderData()] - The context for rendering, defaulting to a new instance.
 * @param {Object|null} [app=null] - The application context, optional parameter.
 * @returns {HTMLElement} The parent element after rendering the template.
 */
function render(element, template, context = new TurtleRenderData(), app = null) {
  let raw = template.raw; // Raw HTML string from the template
  let values = template.values; // Values to be inserted into the raw HTML
  let data = {
    components: {} // Object to hold components being rendered
  };

  for (let i = 0; i < values.length; i++) {
    let key = `turtle-component-${(Math.floor(Math.random() * 999999) * Date.now()).toString(16)}`;
    if (values[i]) {
      if (values[i] instanceof TurtleComponent) {
        data.components[key] = values[i]; // Store the component
        values[i] = key; // Replace component with its key in values
      } else if (values[i].instance === TurtleComponent) {
        data.components[key] = values[i]({}); // Call the instance function if it's a component
        values[i] = key; // Replace instance with its key
      }
    }
  }

  let content = String.raw(raw, ...values);
  let tree = parseHTML(content);

  process(element, tree, context, data, app);

  return element;
}

class TurtleRenderHelper{
  constructor(app,root,context=new TurtleRenderData()){
    this.app = app;
    this.context = context; 
    this.root = root;
  }
  
  fragment(raw,...values){
    return render(document.createDocumentFragment(), { raw, values }, this.context, this.app)
  }
  
  render(raws,...values){
    this.root.textContent = "";
    this.root.appendChild(render(document.createDocumentFragment(), { raw, values }, this.context, this.app));
  }
}

/**
 * Represents a state for a Turtle component.
 * It holds the state name, value, and manages updates when the state changes.
 */
class TurtleComponentState {

  /**
   * Creates an instance of TurtleComponentState.
   * 
   * @param {string} name - The name of the state.
   * @param {*} value - The initial value of the state.
   * @param {Object} component - The component that the state is associated with.
   */
  constructor(name, value, component) {
    this.name = name;
    this.value = value;
    this.component = component;
    this.reactive = true;
  }

  /**
   * Retrieves the current value of the state.
   * 
   * @returns {*} The current value of the state.
   */
  get() {
    return this.value;
  }

  /**
   * Sets a new value for the state and triggers a component update if it's reactive.
   * 
   * @param {*} value - The new value to set for the state.
   * @returns {*} The updated value.
   */
  set(value) {
    this.value = value;
    // Trigger the watcher if one is defined for this state.
    if (this.component.watchers[this.name]) {
      this.component.watchers[this.name](value);
    }
    // Trigger a component update if the component and state are reactive.
    if (this.component.reactive && this.reactive) {
      this.component.requestUpdate({
        state: this.name,
        value: value
      });
    }

    return value;
  }

  /**
   * Synchronizes the state with a given context and key, establishing a binding.
   * 
   * @param {Object} context - The context to bind the state to.
   * @param {string} key - The key under which the state will be bound in the context.
   * @returns {TurtleComponentState} The instance of the state for chaining.
   */
  sync(context, key) {
    context.sync(key, this);
    return this;
  }
}

/**
 * Represents a context for managing bindings and values in the Turtle framework.
 */
class TurtleContext {
  constructor() {
    this._bindings = {};
    this._values = {};
    this._events = {};
    this._isLocal = false;
  }

  /**
   * Updates all reactive bindings for a given name with a new value.
   * 
   * @param {string} name - The name of the binding to update.
   * @param {*} value - The new value to set for the binding.
   * @private
   */
  _reactive(name, value) {
    if (!this._bindings[name]) this._bindings[name] = [];
    for (const bond of this._bindings[name]) {
      bond.set(value);
    }
  }

  /**
   * Sets a value for a given name and triggers reactive updates.
   * 
   * @param {string} name - The name of the value to set.
   * @param {*} value - The value to set.
   */
  set(name, value) {
    this._values[name] = value;
    this._reactive(name, value);
  }

  /**
   * Retrieves the value for a given name.
   * 
   * @param {string} name - The name of the value to retrieve.
   * @returns {*} The value associated with the name.
   */
  get(name) {
    return this._values[name];
  }

  /**
   * Synchronizes a state with a given name, establishing a binding.
   * 
   * @param {string} name - The name to bind the state to.
   * @param {Object} state - The state object to bind.
   */
  sync(name, state) {
    if (!this._bindings[name]) this._bindings[name] = [];
    this._bindings[name].push(state);
  }

  /**
   * Registers an event listener for a specified event name.
   * @param {string} name - The name of the event.
   * @param {Function} callback - The callback function to execute when the event occurs.
   */
  on(name, callback) {
    if (!this._events[name]) {
      this._events[name] = [];
    }
    this._events[name].push(callback);
  }

  /**
   * Unregisters an event listener for a specified event name.
   * @param {string} name - The name of the event.
   * @param {Function} callback - The callback function to remove.
   */
  off(name, callback) {
    if (this._events[name]) {
      this._events[name] = this.events[name].filter(cb => cb !== callback);
    }
  }

  /**
   * Triggers an event with the specified name and data.
   * @param {string} name - The name of the event to trigger.
   * @param {*} data - The data to pass to the event callbacks.
   */
  emit(name, data) {
    if (this._events[name]) {
      this._events[name].forEach(callback => callback(data));
    }
  }
}

/**
 * Manages context retrieval and usage in the Turtle framework.
 */
class TurtleContextManagement {
  constructor(parent, target) {
    this.parent = parent;
    this.target = target;
  }

  /**
   * Retrieves a context by its name, optionally allowing child access.
   * 
   * @param {string} name - The name of the context to retrieve.
   * @param {boolean} isChildAccess - Whether to allow access to child contexts.
   * @returns {TurtleContext|null} The requested context or null if not found.
   */
  get(name, isChildAccess = false) {
    if (this.target._contexts[name] && (isChildAccess && this.target._contexts[name]._isLocal)) {
      return null;
    }

    if (this.target._contexts[name]) {
      return this.target._contexts[name];
    } else if (this.parent) {
      return this.parent.contexts.get(name, true);
    }
  }

  /**
   * Uses a context with a given name and associates it with the target.
   * 
   * @param {string} name - The name of the context to use.
   * @param {TurtleContext} context - The context to use.
   * @param {boolean} isLocal - Indicates whether the context is local.
   */
  use(name, context, isLocal = false) {
    if (this.target._contexts[name] || (this.parent && this.parent.contexts.get(name))) {
      console.warn(`[Turtle Data Warning] Context key "${name}" already exists. The existing context will be overwritten.`);
    }
    this.target._contexts[name] = context;
    this.target._contexts[name]._isLocal = isLocal;
  }
}

/**
 * Represents a Turtle Component.
 */
class TurtleComponent {
  /**
   * Creates an instance of TurtleComponent.
   * @param {Object} props - The properties passed to the component.
   */
  constructor(props) {
    this.parent = null;
    this.app = null;
    this.element = null;
    this.props = props;
    this.watchers = {};
    this.forwardRefs = {};
    this.states = {};
    this.reactive = true;
    this._contexts = {};
    this.contexts = new TurtleContextManagement(this.parent, this);
    this.renderContext = new TurtleRenderData(this);
    emitDevEvent(COMPONENT_INIT, this);
  }

  /**
   * Registers a context for use within the component.
   * @param {string} name - The name of the context.
   * @param {TurtleContext} context - The context instance.
   * @throws {Error} Throws an error if the context is not an instance of TurtleContext.
   */
  useContext(name, context,isLocal=false) {
    if (!(context instanceof TurtleContext)) {
      throw new Error('[Turtle Data Error] Context must be an instance of TurtleContext');
    }
    this.contexts.use(name, context,isLocal);
    return context
  }

  /**
   * Retrieves a context by name.
   * @param {string} name - The name of the context.
   * @returns {TurtleContext} The requested context instance.
   */
  getContext(name) {
    return this.contexts.get(name);
  }

  /**
   * Gets the references from the render context.
   * @returns {Object} The refs object.
   */
  get refs() {
    return this.renderContext.refs;
  }

  /**
   * Creates a new state for the component.
   * @param {string} name - The name of the state.
   * @param {*} value - The initial value of the state.
   * @returns {TurtleComponentState} The created state object.
   */
  createState(name, value) {
    let state = new TurtleComponentState(name, value, this);
    this.states[name] = state;
    return state;
  }

  /**
   * Sets the state of the component.
   * @param {string} name - The name of the state.
   * @param {*} value - The new value of the state.
   */
  setState(name, value) {
    if (!this.states[name]) {
      this.states[name] = new TurtleComponentState(name, value, this);
    }
    this.states[name].set(value);
  }

  /**
   * Gets the value of a specific state.
   * @param {string} name - The name of the state.
   * @returns {*} The value of the state.
   */
  getState(name) {
    return this.states[name].get();
  }

  /**
   * Gets the state object by its name.
   * @param {string} name - The name of the state.
   * @returns {TurtleComponentState} The state object.
   */
  state(name) {
    return this.states[name];
  }

  /**
   * Creates a fragment using a template literal and values.
   * @param {TemplateStringsArray} raw - The raw template literal.
   * @param {...*} values - The values to be used in the template.
   * @returns {DocumentFragment} The rendered HTML as a DocumentFragment.
   */
  html(raw, ...values) {
    let fragment = render(document.createDocumentFragment(), { raw, values }, this.renderContext, this.app);
    return fragment;
  }

  /**
   * Sets up the initial states for the component.
   * Should be overridden by subclasses.
   * @returns {Object} An object containing initial state values.
   */
  setupState() {
    return {};
  }

  /**
   * Sets up watchers for the component.
   * Should be overridden by subclasses.
   * @returns {Object} An object containing watcher functions.
   */
  setupWatcher() {
    return {};
  }

  /**
   * Sets up forward references for the component.
   * Should be overridden by subclasses.
   * @returns {Object} An object containing forward references.
   */
  setupForwardRef() {
    return {};
  }

  /**
   * Lifecycle method called when the component is initialized.
   * Should be overridden by subclasses.
   */
  onInit() {}

  /**
   * Lifecycle method called when the component is created.
   * Should be overridden by subclasses.
   */
  onCreate() {}

  /**
   * Lifecycle method called when the component is destroyed.
   * Should be overridden by subclasses.
   */
  onDestroy() {}

  /**
   * Lifecycle method called after the component is rendered.
   * Should be overridden by subclasses.
   */
  onRender() {}

  /**
   * Lifecycle method called when the component is updated.
   * Should be overridden by subclasses.
   * @param {Object} commit - The commit object representing state changes.
   */
  onUpdate(commit) {}

  /**
   * Returns the template of the component.
   * Should be overridden by subclasses.
   * @returns {DocumentFragment} The template as a DocumentFragment.
   */
  template() {}

  /**
   * Requests an update for the component and triggers the onUpdate lifecycle method.
   * @param {Object} commit - The commit object representing state changes.
   * @returns {Promise<void>}
   */
  async requestUpdate(commit) {
    this._reactive(commit);
    emitDevEvent(COMPONENT_UPDATED, this);
    this.onUpdate(commit);
  }

  /**
   * Requests a render for the component using its template.
   * @returns {Promise<void>}
   */
  async requestRender() {
    let fragment = this.template();
    this.element.textContent = "";
    this.element.appendChild(fragment);
    emitDevEvent(COMPONENT_RENDERED, this);
    this.onRender();
  }

  /**
   * Handles reactivity for state changes.
   * @param {Object} commit - The commit object representing state changes.
   */
  _reactive(commit) {
    let bindings = this.renderContext.bindings[commit.state];
    if (!bindings) return;
    for (let bind of bindings) {
      if (bind.type === "property") bind.target[bind.name] = commit.value;
      if (bind.type === "attribute") bind.target.setAttribute(bind.name, commit.value);
    }
  }

  /**
   * Initializes the states for the component.
   * @param {Object} states - An object containing state names and initial values.
   */
  initStates(states) {
    for (let stateName in states) {
      this.states[stateName] = new TurtleComponentState(stateName, states[stateName], this);
    }
  }

  /**
   * Starts the component by setting up forward references, watchers, and states, then requests a render.
   */
  start() {
    this.forwardRefs = this.setupForwardRef() ?? {};
    this.watchers = this.setupWatcher() ?? {};
    this.initStates(this.setupState() ?? {});
    
  }
  
  startRender(){
    this.requestRender();
  }
}

/**
 * Creates a new TurtleComponent instance.
 * @param {Function} constructor - The constructor function for the TurtleComponent.
 * @returns {Function} A function that creates an instance of the specified component.
 */
function createComponent(constructor) {
  /**
   * Initializes the component with the given properties.
   * @param {Object} props - The properties to be passed to the component.
   * @returns {TurtleComponent} The instantiated component.
   */
  function fn(...props) {
    let component = new constructor(props);
    component.props = props;
    return component;
  }

  fn.instance = TurtleComponent;
  return fn;
}

/**
 * Represents a service that manages contexts and methods for an entity.
 */
class TurtleService {
  /**
   * Creates an instance of TurtleService.
   *
   * @param {Object} entity - The entity that this service will manage.
   */
  constructor(entity) {
    this.entity = entity;
    this.methods = {};
    this._contexts = {};
    this.contexts = new TurtleContextManagement(this.entity, this);
  }

  /**
   * Uses a context by name and sets it in the service.
   *
   * @param {string} name - The name of the context.
   * @param {TurtleContext} context - The context to set, must be an instance of TurtleContext.
   * @throws {Error} Throws an error if the context is not an instance of TurtleContext.
   */
  useContext(name, context) {
    if (!(context instanceof TurtleContext)) {
      throw new Error('[Turtle Data Error] Context must be an instance of TurtleContext');
    }
    this.contexts.set(name, context);
  }

  /**
   * Retrieves a context by name.
   *
   * @param {string} name - The name of the context to retrieve.
   * @returns {TurtleContext|null} The context associated with the given name, or null if not found.
   */
  getContext(name) {
    return this.contexts.get(name);
  }

  /**
   * Defines a method with a name and a callback.
   *
   * @param {string} name - The name of the method to define.
   * @param {Function} callback - The callback function to be executed when the method is called.
   */
  define(name, callback) {
    this.methods[name] = callback.bind(this);
  }

  /**
   * Calls and returns all defined methods.
   *
   * @returns {Object} An object containing all defined methods.
   */
  call() {
    return this.methods;
  }
}

/**
 * Class representing the main application for the Turtle library.
 */
class TurtleApp {
  /**
   * Creates an instance of TurtleApp.
   * @param {Object} [configs={}] - Configuration options for the app.
   */
  constructor(configs = {}) {
    this.root = null;
    this.configs = configs;
    this._contexts = {};
    this.modules = [];
    this.contexts = new TurtleContextManagement(null, this);
    emitDevEvent(APP_INIT, this);
  }

  /**
   * Initializes and uses a specified module.
   * @param {Object} module - The module to be initialized.
   * @param {Object} [configs] - Configuration options for the module.
   * @returns {*} The result of the module's initialization.
   */
  useModule(module, configs) {
    return module.init(this, configs);
  }

  /**
   * Retrieves a context by its name.
   * @param {string} name - The name of the context.
   * @returns {TurtleContext|null} The context associated with the given name, or null if not found.
   */
  getContext(name) {
    return this.contexts.get(name);
  }

  /**
   * Attaches a context to the app by name.
   * @param {string} name - The name of the context.
   * @param {TurtleContext} context - An instance of TurtleContext to attach.
   * @throws {Error} Throws an error if the context is not an instance of TurtleContext.
   */
  useContext(name, context) {
    if (!(context instanceof TurtleContext)) {
      throw new Error('[Turtle Data Error] Context must be an instance of TurtleContext');
    }
    this.contexts.use(name, context);
  }

  /**
   * Attaches the specified HTML element as the root for rendering.
   * @param {HTMLElement} element - The HTML element to use as the root.
   * @throws {Error} Throws an error if the element is not an instance of HTMLElement.
   */
  attach(element) {
    emitDevEvent(APP_ATTACHED, this);
    if (element instanceof HTMLElement) {
      this.root = element;
    } else {
      throw new Error('[Turtle Render Error] Element must be an instance of HTMLElement');
    }
  }

  /**
   * Renders the provided raw content and values into the root element.
   * @param {TemplateStringsArray} raw - A template string containing the static parts of the template.
   * @param {...*} values - Values to be interpolated into the template.
   * @throws {Error} Throws an error if the root element is not attached.
   */
  render(raw, ...values) {
    if (!this.root) {
      throw new Error('[Turtle Render Error] Root element is not attached. Please attach a root element before rendering.');
    }

    this.root.textContent = "";
    this.root.appendChild(render(document.createDocumentFragment(), { raw, values }, new TurtleRenderData(this), this));
  }
  
  fragment(raw,...values){
    return render(document.createDocumentFragment(), { raw, values }, new TurtleRenderData(this), this)
  }
  
}

class TurtleRouteComponent extends TurtleComponent {
  constructor(props) {
    super(props);
    this.matched = false;
  }

  onInit() {
    const [routes] = this.props;

    if (Array.isArray(routes)) {
      this.routes = {};
      routes.forEach(({ component, path }) => {
        if (Array.isArray(path)) {
          path.forEach(p => this.routes[p] = component);
        } else {
          this.routes[path] = component;
        }
      });
    } else if (typeof routes === "object") {
      this.routes = routes;
    }

  }

  active() {
    if (this.app.router) {
      let router = this.app.router;
      let [status, matched] = router.match(Object.keys(this.routes), router.currentPath());
      if ((status) && !this.matched) {
        this.matched = true;
        this.element.appendChild(this.html`
          <${this.routes[matched]}/>
        `);
      }
      if (!status) {
        this.matched = false;
        this.element.textContent = "";
      }
    }
  }

  onRender() {
    this.active();
    if (this.app.router) {
      this.app.router.on("pagechange", this.active.bind(this));
    }
  }

  template() {
    return this.html``
  }
}


const TurtleRoute = createComponent(TurtleRouteComponent);

/**
 * TurtleRouterModule manages routing in a Turtle application.
 * It handles matching routes, invoking callbacks, and rendering components based on URLs.
 */
class TurtleRouterModule {

  /**
   * Creates a new TurtleRouterModule instance.
   *
   * @param {Object} app - The Turtle app instance this router is attached to.
   * @param {Object} configs - Configuration for the router, including the root element.
   */
  constructor(app, configs) {
    this.root = configs.element ?? document.createElement("div");
    this._app = app;
    this._app.modules.push(this);
    this._app.router = this;
    this.routes = {};
    this.matched = null;
    this.url = null;
    this.params = {};
    this.query = new URLSearchParams();
    this.events = {
      notallow: [],
      notfound: [],
      pagematches: [],
      pageloaded: [],
      pagechange: []
    };
  }

  /**
   * Registers an event listener for a specific router event.
   *
   * @param {string} event - The name of the event (e.g., 'pagechange', 'notfound').
   * @param {function} callback - The function to call when the event is triggered.
   */
  on(event, callback) {
    this.events[event].push(callback);
  }

  /**
   * Unregisters an event listener for a specific router event.
   *
   * @param {string} event - The name of the event.
   * @param {function} callback - The callback function to remove.
   */
  off(event, callback) {
    this.events[event].forEach((fn, idx) => {
      if (fn === callback) {
        this.events[event].splice(idx, 1);
      }
    });
  }

  /**
   * Initializes the TurtleRouterModule.
   *
   * @param {Object} app - The Turtle app instance.
   * @param {Object} configs - Configuration for the router.
   * @returns {TurtleRouterModule} - The initialized router module.
   */
  static init(app, configs) {
    return new TurtleRouterModule(app, configs);
  }

  match(patterns, url) {
    let u = new URL(url, window.location.origin);
    url = u.pathname;

    if (!patterns) return
    for (let i = 0; i < patterns.length; i++) {
      let route = patterns[i];
      let routeSplited = route.split("/");
      let urlSplited = url.split("/");
      let passed = true;

      if (urlSplited.length != routeSplited.length) {
        passed = false;
      } else {
        for (let i = 0; i < routeSplited.length; i++) {
          if (urlSplited[i] === undefined) {
            passed = false;
          }

          if (routeSplited[i] == "*") {
            break;
          }

          if (routeSplited[i][0] == ":") {
            routeSplited[i].substring(1, routeSplited[i].length);
            urlSplited[i];
            continue;
          }

          if (routeSplited[i] != urlSplited[i]) {
            passed = false;
          }
        }
      }
      if (passed) return [true,route]
    }
    return [false,null]
  }

  /**
   * Matches the provided URL against the router's routes.
   *
   * @param {string} url - The URL to match against the defined routes.
   * @returns {Promise<void>} - A promise that resolves when the match is complete.
   */
  async matches(url) {
    let u = new URL(url, window.location.origin);
    url = u.pathname;
    this.emitEvent("pagechange", this);
    for (let j = 0; j < Object.keys(this.routes).length; j++) {
      let route = Object.keys(this.routes)[j];
      let configs = this.routes[route];
      let routeSplited = route.split("/");
      let urlSplited = url.split("/");
      let passed = true;
      let params = {};

      if (urlSplited.length != routeSplited.length) {
        passed = false;
      } else {
        for (let i = 0; i < routeSplited.length; i++) {
          if (urlSplited[i] === undefined) {
            passed = false;
          }

          if (routeSplited[i] == "*") {
            break;
          }

          if (routeSplited[i][0] == ":") {
            let name = routeSplited[i].substring(1, routeSplited[i].length);
            params[name] = urlSplited[i];
            continue;
          }

          if (routeSplited[i] != urlSplited[i]) {
            passed = false;
          }
        }
      }

      if (passed) {
        this.params = params;
        this.query = u.searchParams;
        this.matched = route;
        this.url = url;
        let component = new Function();
        if (configs.callback) { await configs.callback(); }
        if (configs.protect) {
          let result = await configs.protect();
          if (!result) {
            this.triggerError("not_allow");
            return;
          }
        }
        this.emitEvent("pagematches", this);

        if (configs.loader) {
          component = await configs.loader();
        }

        if (configs.component) {
          component = configs.component;
        }
        let ctx = this;
        let element = this.root;

        function renderContent(raw, ...values) {
          element.textContent = "";
          element.appendChild(render(document.createDocumentFragment(), { raw, values }, new TurtleRenderData(ctx._app), ctx._app));
        }

        this.emitEvent("pageloaded", this);
        return renderContent`<${component}/>`;
      }
    }

    this.triggerError("not_found");
  }

  /**
   * Starts the router and listens for changes in the URL.
   */
  start() {
    let started = false;
    let path = window.location.hash;
    if (path.length == 0) {
      path = "/";
      window.location = "#";
    } else {
      path = path.slice(2);
    }

    window.addEventListener("hashchange", function() {
      if (started) {
        let path = window.location.hash;
        if (path.length == 0) {
          path = "/";
        } else {
          path = path.slice(2);
        }

        this.matches(path);
      }
    }.bind(this));
    started = true;
    this.matches(path);
    started = true;
  }

  currentPath() {
    let path = window.location.hash;
    if (path.length == 0) {
      path = "/";
    } else {
      path = path.slice(2);
    }
    return path
  }

  /**
   * Redirects to a new route.
   *
   * @param {string} path - The path to navigate to.
   * @param {boolean} [replace=false] - Whether to replace the current URL or push a new one.
   */
  redirect(path, replace = false) {
    if (!replace) {
      window.location.hash = `!${path}`;
    } else {
      window.history.replaceState(null, null, `./#!${path}`);
      this.matches(path);
    }
  }

  /**
   * Emits an event.
   *
   * @param {string} name - The event name.
   * @param {*} data - The data to pass with the event.
   */
  emitEvent(name, data) {
    this.events[name].forEach(fn => {
      fn(data);
    });
  }

  /**
   * Triggers a router error event.
   *
   * @param {string} name - The error event name (e.g., 'not_allow', 'not_found').
   */
  triggerError(name) {
    switch (name) {
      case 'not_allow':
        this.emitEvent("notallow", this);
        break;

      case 'not_found':
        this.emitEvent("notfound", this);
        break;
    }
  }
}

class TurtleFormModuleValidatorRules {
  /**
   * Creates an instance of TurtleFormModuleValidatorRules.
   */
  constructor() {
    this.validations = [];
    this.errors = [];
    this.fieldAlias = null;
  }

  /**
   * Sets an alias for the field being validated.
   * @param {string} name - The alias name for the field.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  alias(name) {
    this.validations.push({
      rule: (value) => true,
    });
    this.fieldAlias = name;
    return this;
  }

  /**
   * Validates that the value is not null or empty.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNotNull() {
    this.validations.push({
      rule: (value) => value !== null && value !== undefined && value.trim() !== "",
      errorMessage: "Value cannot be null or empty."
    });
    return this;
  }

  /**
   * Validates that the value does not exceed the specified maximum length.
   * @param {number} max - The maximum allowed length of the value.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  maxLength(max) {
    this.validations.push({
      rule: (value) => value.length <= max,
      errorMessage: `Value must be at most ${max} characters long.`
    });
    return this;
  }

  /**
   * Validates that the value meets the specified minimum length.
   * @param {number} min - The minimum required length of the value.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  minLength(min) {
    this.validations.push({
      rule: (value) => value.length >= min,
      errorMessage: `Value must be at least ${min} characters long.`
    });
    return this;
  }

  /**
   * Validates that the value contains at least one number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsNumber() {
    this.validations.push({
      rule: (value) => /\d/.test(value),
      errorMessage: "Value must contain at least one number."
    });
    return this;
  }

  /**
   * Validates that the value contains at least one uppercase letter.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsUppercase() {
    this.validations.push({
      rule: (value) => /[A-Z]/.test(value),
      errorMessage: "Value must contain at least one uppercase letter."
    });
    return this;
  }

  /**
   * Validates that the value contains at least one lowercase letter.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsLowercase() {
    this.validations.push({
      rule: (value) => /[a-z]/.test(value),
      errorMessage: "Value must contain at least one lowercase letter."
    });
    return this;
  }

  /**
   * Validates that the value contains at least one special character.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsSpecialChar() {
    this.validations.push({
      rule: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      errorMessage: "Value must contain at least one special character."
    });
    return this;
  }

  /**
   * Validates that the value is a valid email address.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isEmail() {
    this.validations.push({
      rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMessage: "Value must be a valid email address."
    });
    return this;
  }

  /**
   * Validates that the value is a valid phone number in international format.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isPhoneNumber() {
    this.validations.push({
      rule: (value) => /^\+?[1-9]\d{1,14}$/.test(value),
      errorMessage: "Value must be a valid phone number in international format."
    });
    return this;
  }

  /**
   * Validates that the value is a valid date.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isDate() {
    this.validations.push({
      rule: (value) => !isNaN(Date.parse(value)),
      errorMessage: "Value must be a valid date."
    });
    return this;
  }

  /**
   * Validates that the date is before a specified date.
   * @param {string} date - The date to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isBefore(date) {
    this.validations.push({
      rule: (value) => new Date(value) < new Date(date),
      errorMessage: `Date must be before ${date}.`
    });
    return this;
  }

  /**
   * Validates that the date is after a specified date.
   * @param {string} date - The date to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isAfter(date) {
    this.validations.push({
      rule: (value) => new Date(value) > new Date(date),
      errorMessage: `Date must be after ${date}.`
    });
    return this;
  }

  /**
   * Validates that the value is within a specified range.
   * @param {number} min - The minimum allowed value.
   * @param {number} max - The maximum allowed value.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isInRange(min, max) {
    this.validations.push({
      rule: (value) => value >= min && value <= max,
      errorMessage: `Value must be between ${min} and ${max}.`
    });
    return this;
  }

  /**
   * Validates that the value matches a specified regular expression.
   * @param {RegExp} regex - The regular expression to test against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  matchesRegex(regex) {
    this.validations.push({
      rule: (value) => regex.test(value),
      errorMessage: `Value must match the required pattern.`
    });
    return this;
  }

  /**
   * Validates that the value contains only alphabetic characters.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isAlpha() {
    this.validations.push({
      rule: (value) => /^[a-zA-Z]+$/.test(value),
      errorMessage: "Value must contain only alphabetic characters."
    });
    return this;
  }

  /**
   * Validates that the value contains only alphanumeric characters.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isAlphaNumeric() {
    this.validations.push({
      rule: (value) => /^[a-zA-Z0-9]+$/.test(value),
      errorMessage: "Value must contain only alphanumeric characters."
    });
    return this;
  }

  /**
   * Validates that the value contains only numeric characters.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNumeric() {
    this.validations.push({
      rule: (value) => /^[0-9]+$/.test(value),
      errorMessage: "Value must contain only numeric characters."
    });
    return this;
  }

  /**
   * Validates that the value is a valid URL.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isUrl() {
    this.validations.push({
      rule: (value) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
      errorMessage: "Value must be a valid URL."
    });
    return this;
  }

  /**
   * Validates that the value is equal to a specified value.
   * @param {*} compareValue - The value to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isEqualTo(compareValue) {
    this.validations.push({
      rule: (value) => value === compareValue,
      errorMessage: `Value must be equal to ${compareValue}.`
    });
    return this;
  }

  /**
   * Validates that the value is not equal to a specified value.
   * @param {*} compareValue - The value to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNotEqualTo(compareValue) {
    this.validations.push({
      rule: (value) => value !== compareValue,
      errorMessage: `Value must not be equal to ${compareValue}.`
    });
    return this;
  }

  /**
   * Validates that the value starts with a specified prefix.
   * @param {string} prefix - The prefix to check against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  startsWith(prefix) {
    this.validations.push({
      rule: (value) => value.startsWith(prefix),
      errorMessage: `Value must start with '${prefix}'.`
    });
    return this;
  }

  /**
   * Validates that the value ends with a specified suffix.
   * @param {string} suffix - The suffix to check against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  endsWith(suffix) {
    this.validations.push({
      rule: (value) => value.endsWith(suffix),
      errorMessage: `Value must end with '${suffix}'.`
    });
    return this;
  }

  /**
   * Validates that the value is a positive number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isPositiveNumber() {
    this.validations.push({
      rule: (value) => !isNaN(value) && Number(value) > 0,
      errorMessage: "Value must be a positive number."
    });
    return this;
  }

  /**
   * Validates that the value is a negative number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNegativeNumber() {
    this.validations.push({
      rule: (value) => !isNaN(value) && Number(value) < 0,
      errorMessage: "Value must be a negative number."
    });
    return this;
  }

  /**
   * Validates that the value is an integer.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isInteger() {
    this.validations.push({
      rule: (value) => Number.isInteger(Number(value)),
      errorMessage: "Value must be an integer."
    });
    return this;
  }

  /**
   * Validates that the value is a floating-point number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isFloat() {
    this.validations.push({
      rule: (value) => !isNaN(value) && value.toString().includes('.'),
      errorMessage: "Value must be a floating-point number."
    });
    return this;
  }

  validate(value) {
    this.errors = [];
    for (const validation of this.validations) {
      if (!validation.rule(value)) {
        this.errors.push(validation.errorMessage);
      }
    }
    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }

}

/**
 * Class representing a form validator module.
 */
class TurtleFormModuleValidator {
  /**
   * Creates an instance of the form validator.
   * @param {Object} module - The module associated with the validator.
   * @param {HTMLElement} element - The form element to validate.
   */
  constructor(module, element) {
    this._module = module;
    this.element = element;
    this.events = {};
    this.rules = {};
  }

  /**
   * Registers an event listener for a specified event name.
   * @param {string} name - The name of the event.
   * @param {Function} callback - The callback function to execute when the event occurs.
   */
  on(name, callback) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(callback);
  }

  /**
   * Unregisters an event listener for a specified event name.
   * @param {string} name - The name of the event.
   * @param {Function} callback - The callback function to remove.
   */
  off(name, callback) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter(cb => cb !== callback);
    }
  }

  /**
   * Validates the form elements based on defined rules and triggers the appropriate events.
   */
  validate() {
    const values = {};
    const errors = [];
    for (const selector in this.rules) {
      const value = this.element.querySelector(selector).value;
      const validator = this.rules[selector];
      if (!validator.validate(value)) {
        errors.push({ field: selector, messages: validator.getErrors() });
      } else {
        values[validator.fieldAlias ?? selector] = value;
      }
    }

    if (errors.length > 0) {
      this.triggerEvent('error', errors);
    } else {
      this.triggerEvent('success', values);
    }
  }

  /**
   * Triggers an event with the specified name and data.
   * @param {string} name - The name of the event to trigger.
   * @param {*} data - The data to pass to the event callbacks.
   */
  triggerEvent(name, data) {
    if (this.events[name]) {
      this.events[name].forEach(callback => callback(data));
    }
  }

  /**
   * Validates the form when it is submitted, preventing default form submission if specified.
   * @param {boolean} [prevent=true] - Whether to prevent the default form submission.
   */
  validateWhenSubmit(prevent = true) {
    this.element.addEventListener("submit", function(event) {
      if (prevent) event.preventDefault();
      this.validate();
    }.bind(this));
  }
}

/**
 * Class representing the form module in the application.
 */
class TurtleFormModule {
  /**
   * Creates an instance of the form module.
   * @param {Object} app - The application instance.
   * @param {Object} configs - Configuration options for the form module.
   */
  constructor(app, configs) {
    this._app = app;
    this._app.modules.push(this);
    this._app.form = this;
    this.configs = configs;
  }

  /**
   * Initializes the form module.
   * @param {Object} app - The application instance.
   * @param {Object} configs - Configuration options for the form module.
   * @returns {TurtleFormModule} The initialized form module.
   */
  static init(app, configs) {
    return new TurtleFormModule(app, configs);
  }

  /**
   * Creates a form validator for a specified form element.
   * @param {HTMLElement} element - The form element to validate.
   * @returns {TurtleFormModuleValidator} The form validator instance.
   */
  createFormValidator(element) {
    return new TurtleFormModuleValidator(this, element);
  }
}

/**
 * Dynamically loads a script into the document.
 *
 * @param {string} src - The source URL of the script to load.
 * @param {boolean} [asyncLoad=false] - Whether to load the script asynchronously.
 * @param {boolean} [module=false] - Whether the script should be loaded as a JavaScript module.
 * @param {HTMLScriptElement} [script] - The script element that will be created (optional).
 * @returns {Promise<void>} - A promise that resolves when the script is loaded, or rejects on error.
 */
function addScript(src, asyncLoad = false, module = false, script) {
  let d = document;
  return new Promise((resolve, reject) => {
    script = d.createElement('script');
    script.type = 'text/javascript';
    if (module) script.type = 'module';
    script.async = asyncLoad;
    script.onload = function() {
      resolve();
    };
    script.onerror = function() {
      reject(new Error(`Failed to load script: ${src}`));
    };
    script.src = src;
    d.getElementsByTagName('body')[0].appendChild(script);
  });
}

/**
 * Ensures that a namespace is available in the given context by dynamically loading a script if needed.
 *
 * @param {string} name - The name of the namespace to check.
 * @param {Object} context - The context in which to check for the namespace (usually the global object).
 * @param {string} path - The path to the script that defines the namespace.
 * @param {boolean} defer - Whether to defer loading of the script.
 * @param {boolean} [module=false] - Whether the script should be loaded as a JavaScript module.
 * @param {boolean} [raise=false] - Whether to throw an error if the script fails to load.
 * @returns {Promise<void>} - A promise that resolves when the namespace is available.
 */
async function ensureNamespace(name, context, path, defer, module = false, raise = false) {
  if (!(name in context)) {
    try {
      await addScript(path, defer, module);
    } catch (error) {
      if (raise) {
        throw new Error(`Failed to ensure namespace: ${name} - ${error.message}`);
      }
    }
  }
}

/**
 * Creates a throttled function that only invokes the provided function at 
 * most once per specified time interval.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time interval in milliseconds to limit the 
 *                         function calls.
 * @returns {Function} A new throttled function.
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event triggered');
 * }, 1000);
 *
 * window.addEventListener('scroll', handleScroll);
 */
function throttle(func, limit) {
  let lastFunc;
  let lastRan;

  return function(...args) {
    const context = this;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Creates a debounced function that delays invoking the provided function 
 * until after a specified delay period has elapsed since the last time the 
 * debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A new debounced function.
 *
 * @example
 * const handleResize = debounce(() => {
 *   console.log('Resize event triggered');
 * }, 200);
 *
 * window.addEventListener('resize', handleResize);
 */
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const performance = {
  debounce,
  throttle
};

window.__TURTLE__={
  dev:false,
  version:"2.0.0"
};

if(!window.__TURTLE__.dev){
  window.__TURTLE__.dev = true;
  initDevMode();
}

exports.TurtleApp = TurtleApp;
exports.TurtleComponent = TurtleComponent;
exports.TurtleComponentElement = TurtleComponentElement;
exports.TurtleContext = TurtleContext;
exports.TurtleContextManagement = TurtleContextManagement;
exports.TurtleDevEvents = events;
exports.TurtleFormModule = TurtleFormModule;
exports.TurtleFormModuleValidatorRules = TurtleFormModuleValidatorRules;
exports.TurtleRenderData = TurtleRenderData;
exports.TurtleRenderHelper = TurtleRenderHelper;
exports.TurtleRoute = TurtleRoute;
exports.TurtleRouteComponent = TurtleRouteComponent;
exports.TurtleRouterModule = TurtleRouterModule;
exports.TurtleService = TurtleService;
exports.addScript = addScript;
exports.createComponent = createComponent;
exports.emitDevEvent = emitDevEvent;
exports.ensureNamespace = ensureNamespace;
exports.performance = performance;
//# sourceMappingURL=development.turtle.cjs.map
