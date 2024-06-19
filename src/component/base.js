class TurtleBaseComponent extends HTMLElement {
  constructor(){
    super()
    
  }
  
  connectedCallback(){
    this._component = this._instance.call()
    this._component._element = this
    this._component.onCreate()
    this._component._render()
  }
}

window.customElements.define("turtle-component",TurtleBaseComponent)