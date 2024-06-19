import {TurtleElement} from "./Element.js"
export class TurtleListElement{
  constructor(parent,list){
    this.parent = parent
    this.list = list
  }
  
  get length (){
    return this.list.length
  }
  
  each(callback, context){
    this.list.forEach(element=>{
      callback.bind(context)(new TurtleElement(element))
    })
  }
  
  remove (idx){
    try {
      this.list[idx].remove()
    } catch (err) {
      throw `Cannot remove element in list by index :${idx}`
    }
  }
  
  get(idx) {
    try {
      return new TurtleElement(this.list[idx])
    } catch (err) {
      throw `Cannot get element in list by index :${idx}`
    }
  }
  
}