/**
 * Class representing a context for managing values, bindings, and events.
 */
export class TurtleContext {
  constructor() {
    this.values = {}; // Store values associated with the context
    this.bindings = {}; // Store bindings for reactivity
    this.events = {}; // Store event callbacks
  }

  /**
   * Registers an event listener for a given event name.
   * 
   * @param {string} name - The name of the event to listen for.
   * @param {Function} callback - The callback function to execute when the event is emitted.
   */
  on(name, callback) {
    if (!this.events[name]) {
      this.events[name] = []; // Initialize the array if it doesn't exist
    }
    this.events[name].push(callback); // Store the callback
  }

  /**
   * Emits an event with the specified name and data, triggering all registered callbacks.
   * 
   * @param {string} name - The name of the event to emit.
   * @param {*} data - The data to pass to the event listeners.
   */
  emit(name, data) {
    if (!this.events[name]) return; // No listeners for this event
    this.events[name].forEach(callback => {
      callback(data); // Call each registered callback
    });
  }

  /**
   * Initializes the context values.
   * 
   * @param {Object} value - The initial values to set in the context.
   */
  initValue(value) {
    this.values = value;
  }

  /**
   * Initializes a specific state value in the context.
   * 
   * @param {string} name - The name of the state to initialize.
   * @param {*} value - The initial value for the state.
   */
  initState(name, value) {
    this.values[name] = value;
  }

  /**
   * Retrieves a value from the context by its name.
   * 
   * @param {string} name - The name of the value to retrieve.
   * @returns {*} The value associated with the specified name, or undefined if not found.
   */
  get(name) {
    return this.values[name];
  }

  /**
   * Sets a value in the context by its name, and triggers reactive updates.
   * 
   * @param {string} name - The name of the value to set.
   * @param {*} value - The new value to set.
   */
  set(name, value) {
    this.values[name] = value; // Update the value
    this.reactive(name, value); // Trigger reactivity
  }

  /**
   * Binds a state to a key for reactivity.
   * 
   * @param {string} key - The key to bind the state to.
   * @param {Object} state - The state object to bind.
   */
  bind(key, state) {
    this.binding(key, state); // Register the binding
  }

  /**
   * Triggers reactive updates for a given key, notifying all bound states.
   * 
   * @param {string} key - The key whose bindings to update.
   * @param {*} value - The new value to set for the bound states.
   * @private
   */
  _reactive(key, value) {
    if (!this.bindings[key]) return; // No bindings for this key
    this.bindings[key].forEach(state => {
      state.set(value); // Update each bound state
    });
  }

  /**
   * Registers a binding for a specific key and state.
   * 
   * @param {string} key - The key to register the binding for.
   * @param {Object} state - The state object to bind.
   * @private
   */
  _binding(key, state) {
    let component = state.component; // Reference to the component (if needed)
    if (!this.bindings[key]) {
      this.bindings[key] = []; // Initialize the array if it doesn't exist
    }
    this.bindings[key].push(state); // Store the state for reactivity
  }
}