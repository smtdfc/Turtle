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
    this._component = component;
    this._reactive = true;
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
   */
  set(value) {
    this.value = value;

    // Check if the component and state are reactive before triggering an update
    if (this._component._reactive && this._reactive) {
      this._component.requestUpdate({
        state: this.name,
        value: value
      });
    }
    
    return value
  }
}