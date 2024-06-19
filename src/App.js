import {TurtleElement} from "./Element/Element.js"
export class TurtleApp {
  constructor(element) {
    if(element instanceof HTMLElement) element = new TurtleElement(element)
    this.element = element
    this.modules = []
    this.data = {}
  }

  use(module) {
    let m = new module(this).init(this)
    this.modules.push(m)
    return m
  }
  
  render(html){
    this.element.text = ""
    this.element.addChild(html.root)
  }
  
  
}