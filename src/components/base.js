export class TurtleBaseComponent extends HTMLElement {
  constructor() {
    super()
    this._controller = null
  }
  
  connectedCallback(){
    this._controller(this)
  }
}

window.customElements.define("turtle-component",TurtleBaseComponent)