export class TurtleBaseComponent extends HTMLElement {
  constructor() {
    super()
    this._controller = null
    this._c = null
  }
  
  connectedCallback(){
    this._controller(this)
  }
  
  disconnectedCallback(){
    this._c.onDestroy()
  }
}

window.customElements.define("turtle-component",TurtleBaseComponent)