import { TurtleState } from './state.js';
import { render } from '../dom/render.js';

export class TurtleComponent {
  constructor() {
    this._element = null
    this.props = {}
    this.refs = {}
    this.memories = {}
    this.dependencies = []
  }

  _render() {
    this.beforeRender()
    this._element.textContent = ""
    this._element.appendChild(this.template())
    this.afterRender()

    for (let i = 0; i < this.memories.length; i++) {
      let str = this.memories[i].expr
      let value = eval(str)
      if (this.memories[i].type == "html") {
        this.memories[i].element.innerHTML = value
      }

      if (this.memories[i].type == "text") {
        this.memories[i].element.textContent = value
      }
    }
    this.onRender()
  }

  _update() {
    this.beforeUpdate()
    for (let i = 0; i < this.memories.length; i++) {
      let value = eval(this.memories[i].expr)
      if (this.memories[i].type == "html") {
        this.memories[i].element.innerHTML = value
      }

      if (this.memories[i].type == "text") {
        this.memories[i].element.textContent = value
      }
    }
    this.afterUpdate()
    this.onUpdate()
  }

  onCreate() {}
  onDestroy() {}
  onRender() {}
  onUpdate() {}
  beforeRender() {}
  afterRender() {}
  beforeUpdate() {}
  afterUpdate() {}
  template() {}
  html(raw, ...values) {
    let ctx = {
      type: "component",
      refs: {},
      bindings: []
    }

    let dom = render(raw, values, ctx)
    this.refs = ctx.refs
    this.memories = ctx.bindings
    return dom
  }

  createState(value) {
    return new TurtleState(this, value)
  }

  addUpdateDenpendent(state) {
    this.dependencies.push(state.key)
  }
}

class TurtleComponentCaller {
  constructor(component, props) {
    this.component = component
    this.props = props
  }

  call() {
    let component = new this.component()
    component.props = this.props
    return component
  }

}

export function createComponent(_constructor) {

  function fn(...props) {
    return new TurtleComponentCaller(_constructor, props)
  }

  fn.ins = TurtleComponent
  return fn
}