export class TurtleListAttribute{
  constructor(element,attributes ){
    this.element = element
    this.attributes = attributes
  }
  
  index(idx){
    return this.attributes[idx]
  }
  
  get length(){
    return this.attributes.length
  }
  
  get(name){
    return this.attributes.getNamedItem(name)
  }
  
  each(callback){
    for (var attr in this.attributes) {
      callback(this.attributes[attr])
    }
  }
  
  remove(name){
    this.attributes.removeNamedItem(name)
  }
}