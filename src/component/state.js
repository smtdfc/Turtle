export class TurtleState{
  constructor(component,value){
    this.component = component
    this._value = value
    this.key = `${(Math.floor(Math.random() * 999999) * Date.now()).toString(16)}`
  }
  
  get val(){
    return this._value
  }
  
  set value(val){
    
    this._value = val
    this.component._update()
  }
  
}
