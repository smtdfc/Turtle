/**
 * Represents a context for managing bindings and values in the Turtle framework.
 */
export class TurtleContext {
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
export class TurtleContextManagement {
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