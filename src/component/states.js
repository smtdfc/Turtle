export class TurtleComponentState{
   constructor(value, component){
      this._value = value
      this._component = component
      this.reflection = true
   }
   
   get value(){
      return this._value
   }
   
   set value(val){
      this._value = val
      if(this.reflection ){
         this._component.forceUpdate()
      }
   }
}