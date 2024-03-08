import { TurtleComponentInstance } from './index.js';

class TurtleComponentState {
  constructor(component, value) {
    this.component = component
    this._value = value
  }

  get value() {
    return this._value
  }

  set value(val) {
    this._value = val
    if (this.component instanceof TurtleComponentInstance) {
      if (!this.component._reactive) return
      this.component.forceUpdate()
    }
  }
}

export function createState(value) {
  return new TurtleComponentState(null, value)
}