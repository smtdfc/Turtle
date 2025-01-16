export class TurtleRenderContext {
  constructor(target) {
    this.target = target
    this.refs = {}
    this.bindings = {}
  }

  addBinding(dependent, details = {}) {
    if (!this.bindings[dependent]) this.bindings[dependent] = []
    this.bindings[dependent].push({ ...details })
  }

  getBinding(dependent) {
    if (!this.bindings[dependent]) this.bindings[dependent] = []
    return this.bindings[dependent]
  }

  addRef(name, element) {
    this.refs[name] = element
  }
}