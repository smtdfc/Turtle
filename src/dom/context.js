/**
 * The TurtleRenderContext class manages bindings and references during the rendering process.
 */
export class TurtleRenderContext {
  
  /**
   * Creates an instance of TurtleRenderContext.
   * Initializes internal structures for storing bindings and references.
   */
  constructor() {
    /**
     * @type {Object}
     * Stores bindings where keys are state names and values are arrays of configuration objects.
     */
    this._bindings = {};

    /**
     * @type {Object}
     * Stores references where keys are ref names and values are DOM elements.
     */
    this._refs = {};
  }

  /**
   * Adds a binding configuration to the context for a specific state.
   * 
   * @param {string} state - The name of the state to bind to.
   * @param {Object} configs - The binding configuration object.
   * @private
   */
  _addBinding(state, configs) {
    if (!this._bindings[state]) {
      this._bindings[state] = [];
    }
    this._bindings[state].push(configs);
  }

  /**
   * Adds a reference to a DOM element with a unique name.
   * 
   * @param {string} name - The unique name for the reference.
   * @param {HTMLElement} element - The DOM element to be referenced.
   * @throws {Error} Throws an error if a reference with the same name already exists.
   * @private
   */
  _addRef(name, element) {
    if (this._refs[name]) {
      throw new Error(`[Turtle Render Error] Multiple elements are assigned the same ref, which is not allowed. Each ref must be unique to a single DOM element.`);
    }
    
    this._refs[name] = element;
  }
}