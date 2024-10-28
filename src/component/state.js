/**
 * TurtleComponentState class represents a reactive state for a Turtle component.
 * It holds the state name, value, and manages updates when the state changes.
 */
export class TurtleComponentState {

  /**
   * Creates an instance of TurtleComponentState.
   * 
   * @param {string} name - The name of the state.
   * @param {*} value - The initial value of the state.
   * @param {Object} component - The component that the state is associated with.
   */
  constructor(name, value, component) {
    this.name = name;
    this.value = value;
    this.component = component;
    this.reactive = true;
  }

  /**
   * Retrieves the current value of the state.
   * 
   * @returns {*} The current value of the state.
   */
  get() {
    return this.value;
  }

  /**
   * Sets a new value for the state and triggers a component update if it's reactive.
   * 
   * @param {*} value - The new value to set for the state.
   * @returns {*} The updated value.
   */
  set(value) {
    this.value = value;
    // Trigger the watcher if one is defined for this state.
    if (this.component.watchers[name]) this.component.watchers[name](value);
    // Trigger a component update if the component and state are reactive.
    if (this.component.reactive && this.reactive) {
      this.component.requestUpdate({
        state: this.name,
        value: value
      });
    }

    return value;
  }

  /**
   * Synchronizes the state with a given context and key, establishing a binding.
   * 
   * @param {Object} context - The context to bind the state to.
   * @param {string} key - The key under which the state will be bound in the context.
   * @returns {TurtleComponentState} The instance of the state for chaining.
   */
  sync(context, key) {
    context.bind(key, this);
    return this;
  }
}
