export class TurtleContext{
  constructor(){
    this.values = {}
    this._bindings = {}
  }
  
  initValue(value){
    this.values = value
  }
  
  initState(name,value){
    this.values[name] = value
  }
  
  get(name){
    return this.values[name]
  }
  
  set(name,value){
    this.values[name] = value
    this._reactive(name,value)
  }
  
  bind(key,state){
    this._binding(key,state)
  }
  
  _reactive(key,value){
    
    if(!this._bindings[key]) this._bindings[key]=[]
    this._bindings[key].forEach(state=>{
      state.set(value)
    })
  }
  
  
  _binding(key,state){
    let component = state._component
    if(!this._bindings[key]) this._bindings[key]=[]
    this._bindings[key].push(state)
  }
  
}