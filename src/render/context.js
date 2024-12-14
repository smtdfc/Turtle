import {TurtleState} from '../state/index.js';

export class TurtleRenderContext{
  constructor(target){
    this.target = target
  }
  
  addHtmlBind(element,state){
    
    if(!this.target[state]){
      this.target[state] = new TurtleState(this.target)
    }
    
    this.target[state].bindings.push({
      type:"prop",
      name:"innerHTML",
      element
    })
    
    element.innerHTML  = this.target[state].get()
  }
}