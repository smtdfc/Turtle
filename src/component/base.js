import { emitDevEvent } from '../dev/emitter.js';
import * as TURTLE_DEV_EVENTS from '../dev/events.js';

/**
 * Custom element that represents a Turtle component in the DOM.
 * Extends HTMLElement to manage lifecycle and interaction with the Turtle component.
 */
export class TurtleComponentElement extends HTMLElement {
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
    emitDevEvent(TURTLE_DEV_EVENTS.COMPONENT_ATTACHED, component);
  }

  /**
   * Lifecycle method called when the element is inserted into the DOM.
   * Initializes and starts the attached component.
   */
  connectedCallback() {
    this.component.onInit();
    this.component.start();
    this.component.onCreate();
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