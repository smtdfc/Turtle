import { render } from '../dom/render.js';
import { createState } from './state.js';
import {TurtleComponentInstance} from './instance.js';
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

export class TurtleComponent extends TurtleComponentInstance{
  
}

export function createComponent(fn) {
  let fn_component = function(...props) {
    return new TurtleComponentInstance(fn, props)
  }

  fn_component.instance = TurtleComponentInstance
  return fn_component
}