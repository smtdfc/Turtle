export class TurtleContext {
  constructor() {
    this.values = {}
    this._bindings = {}
    this._events = {}
  }

  on(name, callback) {
    if (!this._events[name]) this._events[name] = []
    this._events.push(callback)
  }

  emit(name, data) {
    if (!this._events[name]) this._events[name] = []
    this._events.forEach(callback => {
      callback(data)
    })
  }


  initValue(value) {
    this.values = value
  }

  initState(name, value) {
    this.values[name] = value
  }

  get(name) {
    return this.values[name]
  }

  set(name, value) {
    this.values[name] = value
    this._reactive(name, value)
  }

  bind(key, state) {
    this._binding(key, state)
  }

  _reactive(key, value) {

    if (!this._bindings[key]) this._bindings[key] = []
    this._bindings[key].forEach(state => {
      state.set(value)
    })
  }

  _binding(key, state) {
    let component = state._component
    if (!this._bindings[key]) this._bindings[key] = []
    this._bindings[key].push(state)
  }

}