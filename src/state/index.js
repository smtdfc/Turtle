import { TurtleReactive } from './reactive.js';

export class TurtleState {
  constructor(target, value = null) {
    this.target = target
    this.value = value
    this.reactive = true
    this.bindings = []
    this._watchers = []
  }

  async watch(callback) {
    this._watchers.push(callback)
  }

  async set(value) {
    this.value = value
    this.callWatchers()
    this.updateBinding()
  }

  async callWatchers() {
    for (let watcher of this._watchers) {
      watcher(this)
    }
  }
  
  async updateBinding() {
    if (this.reactive) {
      let bindings = []
      for (let binding of this.bindings) {
        TurtleReactive.reactive(this, binding)
        if (document.body.contains(binding.element)) {
          bindings.push(binding)
        }
      }
      this.bindings = bindings
    }
  }
  get() {
    return this.value
  }
}