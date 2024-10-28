import { TURTLE_DEV_EVENTS, devLog } from '../dev/dev.js';
import { render } from '../render/render.js';
import { TurtleRenderContext } from '../render/context.js';
import { TurtleComponentState } from './state.js';

/**
 * Represents a Turtle Component.
 */
export class TurtleComponent {
  /**
   * Creates an instance of TurtleComponent.
   * @param {Object} props - The properties passed to the component.
   */
  constructor(props) {
    this.app = null;
    this.element = null;
    this.props = props;
    this.watchers = {};
    this.forwardRefs = {};
    this.states = {};
    this.reactive = true;
    this.renderContext = new TurtleRenderContext(this);
  }

  getContext(name) {
    return this.app.contexts[name]
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
    if (!this.states[name]) this.states[name] = new TurtleComponentState(name, value, this);
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
    this.reactive(commit);
    devLog(TURTLE_DEV_EVENTS.COMPONENT_UPDATE, this);
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
    devLog(TURTLE_DEV_EVENTS.COMPONENT_RENDER, this);
    this.onRender();
  }

  /**
   * Handles reactivity for state changes.
   * @param {Object} commit - The commit object representing state changes.
   */

  reactive(commit) {
    let bindings = this.renderContext.bindings[commit.state];
    for (let bind of bindings) {
      if (bind.type == "property") bind.target[bind.name] = commit.value;
      if (bind.type == "attribute") bind.target.setAttribute(bind.name, commit.value);
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
    this.requestRender();
  }
}

/**
 * Creates a new TurtleComponent instance.
 * @param {Function} constructor - The constructor function for the TurtleComponent.
 * @returns {Function} A function that creates an instance of the specified component.
 */
export function createComponent(constructor) {
  /**
   * Initializes the component with the given properties.
   * @param {Object} props - The properties to be passed to the component.
   * @returns {TurtleComponent} The instantiated component.
   */
  function fn(props) {
    let component = new constructor(props);
    component.props = props;
    return component;
  }

  fn.instance = TurtleComponent;
  return fn;
}