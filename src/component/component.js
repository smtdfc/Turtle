import { render } from '../dom/render.js';
import { TurtleRenderContext } from '../dom/context.js';
import { TurtleComponentState } from './state.js';

/**
 * The TurtleComponent class provides a base structure for UI components in the Turtle framework.
 * It handles state management, lifecycle events, and rendering.
 */
export class TurtleComponent {

  /**
   * Creates an instance of TurtleComponent.
   * 
   * @param {HTMLElement} element - The HTML element associated with this component.
   * @param {Object} props - The properties passed to the component.
   */
  constructor(app, element, props) {
    this.app = app
    this._app = app
    this.renderContext = new TurtleRenderContext();
    this.context = {};
    this.element = element;
    this._reactive = true;
    this.props = props;
    this.states = {};
    this._instance = null;
    this.element._component = this;
    this._start();
  }

  /**
   * Called when the component is created.
   * Meant to be overridden by subclasses.
   */
  onCreate() {}

  /**
   * Called when the component is destroyed.
   * Meant to be overridden by subclasses.
   */
  onDestroy() {}

  /**
   * Called after the component is rendered.
   * Meant to be overridden by subclasses.
   */
  onRender() {}

  /**
   * Called after the component's state is updated.
   * Meant to be overridden by subclasses.
   */
  onUpdate() {}

  /**
   * Called when a component's state changes.
   * 
   * @param {Object} commit - Contains information about the state change.
   */
  onStateChange(commit) {}

  /**
   * Creates and registers a new state for the component.
   * 
   * @param {string} name - The name of the state.
   * @param {*} value - The initial value of the state.
   * @returns {TurtleComponentState} - The newly created state object.
   */
  createState(name, value) {
    this.states[name] = new TurtleComponentState(name, value, this);
    return this.states[name];
  }

  /**
   * Updates the value of an existing state.
   * 
   * @param {string} name - The name of the state.
   * @param {*} value - The new value for the state.
   */
  setState(name, value) {
    this.states[name].set(value);
  }

  /**
   * Retrieves the component references from the rendering context.
   * 
   * @returns {Object} - The references to the component's elements.
   */
  get refs() {
    return this.renderContext._refs;
  }

  /**
   * Renders the HTML of the component using template literals.
   * 
   * @param {TemplateStringsArray} raw - The raw template string.
   * @param {...any} values - The values to be interpolated into the template.
   * @returns {DocumentFragment} - The rendered HTML fragment.
   */
  html(raw, ...values) {
    return render(this, document.createDocumentFragment(), { raw, values }, this.renderContext);
  }

  /**
   * Requests an update of the component based on a state change.
   * 
   * @param {Object} commit - Contains information about the state change.
   */
  requestUpdate(commit) {
    this.onStateChange(commit);
    if (!this.renderContext._bindings[commit.state]) return;
    for (let bind of this.renderContext._bindings[commit.state]) {
      if (!this.states[commit.state]) {
        console.warn(`[Turtle Render Warning] State "${commit.state}" does not exist!`);
        return;
      }
      let stateValue = (this.states[commit.state] instanceof Function) ? this.states[commit.state]() : this.states[commit.state].value;
      if (!stateValue) {
        console.warn(`[Turtle Render Warning] State "${commit.state}" does not exist!`);
        return;
      }
      if (bind.type === "property") {
        bind.target[bind.name] = stateValue;
      } else if (bind.type === "attr") {
        bind.target.setAttribute(bind.name, stateValue);
      }
    }
    this.onUpdate();
  }

  /**
   * Forces an update of all bound properties and attributes in the component.
   * Iterates over all bindings and updates them with the current state values.
   */
  _forceUpdateAll() {
    Object.keys(this.renderContext._bindings).forEach(name => {
      if (!this.renderContext._bindings[name]) return;
      for (let bind of this.renderContext._bindings[name]) {
        if (!this.states[name]) {
          console.warn(`[Turtle Render Warning] State "${name}" does not exist!`);
          return;
        }
        let stateValue = (this.states[name] instanceof Function) ? this.states[name]() : this.states[name].value;
        if (!stateValue) {
          console.warn(`[Turtle Render Warning] State "${name}" does not exist!`);
          return;
        }
        if (bind.type === "property") {
          bind.target[bind.name] = stateValue;
        } else if (bind.type === "attr") {
          bind.target.setAttribute(bind.name, stateValue);
        }
      }
    });
  }

  /**
   * Asynchronously renders the component's template, appending it to the component's root element.
   * Calls the onRender() method after rendering is complete.
   */
  async render() {
    let template = this.template();
    this._forceUpdateAll();
    this.element.appendChild(template);
    this.onRender();
  }

  getContext(name) {
    return this.app.contexts[name]
  }
  
  /**
   * Initializes the component by rendering it.
   * Called during the component's construction.
   */
  _start() {
    this.render();
  }
}