import { render } from '../dom/render.js';
import { createState } from './state.js';

function evalInScope(js, contextAsScope) {
  return new Function(`return ${js}`).call(contextAsScope);
}

class TurtleComponentElement extends HTMLElement {
  constructor() {
    super()
    this._controller = null
  }

  connectedCallback() {
    this._controller.start(this)
  }
  
  disconnectedCallback(){
    this._controller.onDestroy()
  }
}

window.customElements.define("turtle-component", TurtleComponentElement)

export class TurtleComponentInstance {
  constructor(fn, props) {
    this.fn = fn
    this.props = props
    this.data = {}
    this._memories = {}
    this._refs = {}
    this._element = null
    this._reactive = true
    this.html = render.bind(this)
    this.onCreate = new Function()
    this.onRender = new Function()
    this.onUpdate = new Function()
    this.onDestroy = new Function()
  }

  get refs() {
    return this._refs
  }
  
  initState(value) {
    let state = createState(value)
    state.component = this
    return state
  }

  addUpdateDependents(dependents) {
    dependents.forEach(dependent => {
      dependent.component = this
    })
  }

  forceUpdate() {
    for (let i = 0; i < this._memories.length; i++) {
      let d = this._memories[i]
      if (d.type == "attr") {
        d.node.setAttribute(
          d.attr,
          evalInScope(d.expr, this)
        )
      }

      if (d.type == "text") {
        d.node.textContent = evalInScope(d.expr, this)
      }

      if (d.type == "html") {
        d.node.innerHTML = evalInScope(d.expr, this)
      }
    }
    this.onUpdate()
  }

  start(element) {
    this._element = element
    let { root, context } = this.requestRender()
    this._element.appendChild(root)
    this._memories = context._memories
    this._refs = context._refs

    for (let i = 0; i < this._memories.length; i++) {
      let d = this._memories[i]
      if (d.type == "attr") {
        d.node.setAttribute(
          d.attr,
          evalInScope(d.expr, this)
        )
      }

      if (d.type == "text") {
        d.node.textContent = evalInScope(d.expr, this)
      }

      if (d.type == "html") {
        d.node.innerHTML = evalInScope(d.expr, this)
      }
    }

    this.onRender()
  }

  requestRender() {
    return this.fn.bind(this)(this, ...this.props)
  }

}

export function createComponent(fn) {
  let fn_component = function(...props) {
    return new TurtleComponentInstance(fn, props)
  }

  fn_component.instance = TurtleComponentInstance
  return fn_component
}