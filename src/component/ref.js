export class TurtleComponentRef{
 
  #element;
  constructor(element ){
    this.#element = element
  }
  
  get component(){
    return this.#element._component.forwardRef
  }
  
}