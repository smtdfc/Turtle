export class TurtleMemorizeContext{
  constructor(component){
    this.component = component
    this._memories = []
    this._refs = {}
  }
}