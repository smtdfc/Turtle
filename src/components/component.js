import { render } from './render.js';
import {TurtleComponentState} from './state.js';
function evalInScope(js, contextAsScope) {
  return new Function(`return ${js}`).call(contextAsScope);
}

export class TurtleComponent {
  constructor(fn, props) {
    this._fn = fn.bind(this)
    this._props = props
    this._base = null
    this._refs = {}
    this._reactive = true
    this._memories = []
    this.html = render.bind(this)
    this.onCreate = new Function()
    this.onRender = new Function()
    this.onUpdate = new Function()
    this.onDestroy = new Function()
  }
  
  createState(value){
    return new TurtleComponentState(this,value)
  }
  
  get refs(){
    return this._refs
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

  start() {
    this.onCreate()
    this._base.appendChild(this._fn(this,...this._props))
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
  
  
}

export function createComponent(fn) {
  let fn_component = function(...props) {
    return new TurtleComponent(fn, props)
  }
  fn_component.instance = TurtleComponent
  return fn_component
}