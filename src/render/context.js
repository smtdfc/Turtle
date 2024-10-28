/**
 * Represents the rendering context for Turtle components.
 * This class manages references, bindings, and events for rendering.
 */
export class TurtleRenderContext {
  /**
   * Creates an instance of TurtleRenderContext.
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
   * @param {Object} configs - Configuration object for the binding.
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


}