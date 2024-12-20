export class TurtleContextManager {
  #_contexts;
  constructor(target, parent = null) {
    this._target = target
    this._parent = parent
    this.#_contexts = {}
  }

  get(name, traceback = true) {
    if (!this.#_contexts[name]) {
      if (traceback && this._parent) return this._parent.contexts.get(name, true)
      else return null
    } else {
      return this.#_contexts[name]
    }
  }

  use(name, context) {
    this.#_contexts[name] = context
  }

}