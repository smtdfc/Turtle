export class TurtleState{
  constructor(component,value,name, reaction=true){
    this.component = component
    this._value = value
    this._name = name
    this._reaction = reaction
    this.key = `${(Math.floor(Math.random() * 999999) * Date.now()).toString(16)}`
  }
  
  get val(){
    return this._value
  }
  
  set value(val){
    this._value = val
    if(this._reaction){
      this.component._update()
      this.component._updateWithState(this._name)
    }
  }
  
}
