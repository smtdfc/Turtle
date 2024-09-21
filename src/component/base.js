import { TurtleRenderContext } from '../dom/context.js';

/**
 * TurtleElement class is a custom HTML element that manages the lifecycle of a Turtle component.
 * It connects to the DOM and handles lifecycle methods like connectedCallback and disconnectedCallback.
 */
export class TurtleElement extends HTMLElement {

  /**
   * Creates an instance of TurtleElement.
   * This constructor is called when the custom element is created.
   */
  constructor() {
    super();
    /**
     * @type {Object|null} _instance - Stores the component instance, if any.
     */
    this._instance = null;

    /**
     * @type {Object|null} _component - Stores the associated component for the element.
     */
    this._component = null;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   * Used to initialize the component and trigger the `onCreate` lifecycle event.
   */
  connectedCallback() {
    // Ensure that _instance and _component are available before calling methods
    if (this._instance) {
      this._instance.call(this);
    }

    if (this._component) {
      this._component.onCreate();
    }
  }

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   * Used to trigger the `onDestroy` lifecycle event when the component is removed.
   */
  disconnectedCallback() {
    // Ensure that _component is available before calling onDestroy
    if (this._component) {
      this._component.onDestroy();
    }
  }

}

// Define the custom element with the tag name "turtle-component"
window.customElements.define("turtle-component", TurtleElement);