export class TurtleContext{
  constructor(values){
    this.values = {}
    this._bindings = {}
  }
  
  set(key, value){
    this.values[key] = value
    if(this._bindings[key]){
      for (let state of this._bindings[key]) {
        state.set(this.values[key])
      }
    }
  }
  
  bind(key,state,twoWay = true){
    if(!this._bindings[key]) this._bindings[key] =[]
    this._bindings[key].push(state)
    if(twoWay){
      state.bindings.push({
        type:"context",
        context:this,
        key
      })
    }
  }
}