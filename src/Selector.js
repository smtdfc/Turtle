import {TurtleElement} from "./Element/Element.js"

function wrap(context,by,query,res){
  if (!res && context.usePlaceholderElement) {
    return context.placeholderElement
  }else if(res){
    return new TurtleElement(res)
  }else{
    throw `Cannot find element by ${by} :'${query}' ! `
  }
}

const placeholder = new TurtleElement(document.createElement("div"))
export class TurtleSelector{
  constructor(root = document,placeholderElement = placeholder){
    this.root = root
    this.usePlaceholderElement = false
    this.placeholderElement = placeholderElement
  }
  
  byId(id){
    let result = document.getElementById(id)
    return wrap(this,"id",id,result)
  }
  
  byClassName(className,idx=0){
    let result = document.getElementsByClassName(className)[idx]
    return wrap(this,"Class Name",className,result)
  }
  
  byTag(tag,idx=0){
    let result = document.getElementsByTagName(tag)[idx]
    return wrap(this,"Tag Name",className,result)
  }
  
  byName(name, idx = 0) {
    let result = document.getElementsByName(name)[idx]
    return wrap(this, "Name", name, result)
  }
  
  byQuery(query,idx=0){
    let result = document.querySelectorAll(query)[idx]
    return wrap(this, "Query", query, result)
  }
}