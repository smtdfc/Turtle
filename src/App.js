import { TurtleElement } from "./Element/Element.js"
import {createComponent,createStaticComponent} from "./Component/Component.js"
export class TurtleApp {
  constructor(element) {
    this.element = element
    this.scopes = {}
    this.modules = []
    this.components = {}
  }
  
  use(module){
    if(!module.load) throw "Cannot load module !"
    this.modules.push(module.load(this))
  }
  
  render(content) {
    if (this.element instanceof HTMLElement) {
      this.element.innerHTML = content
    } else if (this.element instanceof TurtleElement) {
      this.element.HTML = content
    }
  }

  component(name, callback){
    createComponent(this,name,callback)
  }

  staticComponent(name,callback){
    createStaticComponent(this,name,callback)
  }
}

export function initApp(element){
  return new TurtleApp(element)
}