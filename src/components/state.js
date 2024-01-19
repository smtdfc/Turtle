export class TurtleComponentState{
  constructor(component,value){
    this._component = component
    this._value = value
  }
  
  set val(value){
    this._value = value
    if(this._component._reactive){
      this._component.forceUpdate()
    }
  }
  
  get val(){
    return this._value
  }
}