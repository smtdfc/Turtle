export class TurtleAppService{
  constructor(alias_name,app){
    this.app = app
    this.alias_name = alias_name
    this.app.services[alias_name] = this
  }
  
}