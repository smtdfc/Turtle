import { TurtleRenderContext } from '../dom/context.js';

/**
 * TurtleElement class is a custom HTML element that manages the lifecycle of a Turtle component.
 * It connects to the DOM and handles lifecycle methods like `connectedCallback` and `disconnectedCallback`.
 */
export class TurtleElement extends HTMLElement {

  /**
   * Creates an instance of TurtleElement.
   * This constructor is called when the custom element is created.
   */
  constructor() {
    super();

    /**
     * Stores the component instance, if any.
     * @type {Object|null}
     */
    this._instance = null;
    this._app = null;
    /**
     * Stores the associated component for the element.
     * @type {Object|null}
     */
    this._component = null;

    /**
     * A unique key for identifying the component, generated using a combination of random numbers and the current timestamp.
     * @type {number}&& 
     */
    this._key = (Math.floor(Math.random() * 10000) * Date.now());

    // Register the component in the Turtle development environment if available
    if (window.__TURTLE_DEV__) {
      __TURTLE_DEV__.components[this._key] = this;
    }
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * Used to initialize the component and trigger the `onCreate` lifecycle event.
   */
  connectedCallback() {
    if (this._component) {
      this._component.onCreate();
    }

    // Ensure that _instance and _component are available before calling methods
    if (this._instance) {
      this._instance.call(this);
    }

  }

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   * Used to trigger the `onDestroy` lifecycle event when the component is removed.
   */
  disconnectedCallback() {
    // Remove the component from the Turtle development environment registry
    if (window.__TURTLE_DEV__) {
      __TURTLE_DEV__.components[this._key] = null;
    }

    // Ensure that _component is available before calling onDestroy
    if (this._component) {
      this._component.onDestroy();
    }
  }

}

// Define the custom element with the tag name "turtle-component"
window.customElements.define("turtle-component", TurtleElement);