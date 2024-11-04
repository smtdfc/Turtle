/**
 * Represents a reference to the element associated with a Turtle component.
 */
export class TurtleComponentRef {
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