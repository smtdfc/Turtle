import { TurtleModule } from "../Module.js"
import { generateKey } from "../utils.js"



export class TurtleStoreState {
  constructor(store, value) {
    this.store = store
    this._value = value
    this.bindings = []
    this.actions_fn = {}
    this.actions = {}
  }

  addAction(name, fn) {
    this.actions_fn[nane] = fn
    this.actions[name] = function(value) {
      this.actions_fn[name](value)
    }.bind(this)
    this.actions[name].attrs = {
      state: this
    }
    return this.actions[name]
  }

  bind(component, state) {
    this.bindings.push({
      component: component,
      state: state
    })
  }

  set value(val) {
    this._value = val
    let r = []
    this.bindings.forEach((b, idx) => {
      try {
        b.component.setState(b.state, val)
      } catch (err) {
        this.bindings.splice(idx, 1)
      }
    })

  }

  get value() {
    return this._value
  }
}

export class TurtleStore {
  constructor(name) {
    this.name = name
    this.store_key = generateKey()
    this.states = {}
    window.TURTLE.TURTLE_STORES[name] = this
  }

  setState(name, value) {
    if (!this.states[name]) this.states[name] = new TurtleStoreState(this, value)
    this.states[name].value = value
  }

  getState(name) {
    return this.states[name].value
  }
}


export class StateModule extends TurtleModule {
  constructor(app) {
    super(app)
  }

  init(app) {
    this.app.store = this
    return this
  }

  create(name) {
    return new TurtleStore(name)
  }

}