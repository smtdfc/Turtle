/**
 * Represents the rendering data for Turtle components.
 * This class manages references, bindings, and events for the rendering process.
 */
export class TurtleRenderData {
  /**
   * Creates an instance of TurtleRenderData.
   * 
   * @param {DocumentFragment} [root] - The root element for rendering. Defaults to a new DocumentFragment if not provided.
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
   * @param {Object} configs - The configuration object for the binding, which may include callback functions or parameters.
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
    this.refs[name] = element;
  }

  /**
   * Adds a model binding to a DOM element, updating the state when the element's value changes.
   * Only supports form elements like `<input>`, `<select>`, and `<textarea>`.
   * 
   * @param {string} name - The unique name for the model binding.
   * @param {HTMLElement} element - The DOM element to be bound.
   * @throws {Error} Throws an error if the element type is not supported or the model cannot be bound.
   * @private
   */
  addModel(name, element) {
    if (["INPUT", "SELECT", "TEXTAREA"].includes(element.tagName) && !this.root.is_app) {
      element.addEventListener("input", (event) => {
        if (["checkbox", "radio"].includes(element.type)) {
          this.root.setState(name, element.checked);
        } else {
          this.root.setState(name, element.value);
        }
      });
    }
  }

  /**
   * Retrieves a referenced DOM element by its unique name.
   * 
   * @param {string} name - The unique name of the reference.
   * @returns {HTMLElement} - The DOM element referenced by the given name.
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
   * @param {string} name - The unique name of the reference to remove.
   * @throws {Error} Throws an error if no reference with the given name exists.
   */
  removeRef(name) {
    if (!this.refs[name]) {
      throw new Error(`[Turtle Render Error] Cannot remove ref: No ref found with the name: ${name}`);
    }
    delete this.refs[name];
  }
}