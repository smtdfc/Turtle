import {extractParameters} from './extract.js';

export class TurtleRouterModule{
  constructor(app,configs={}){
    this.app = app
    this.routes = {} 
  }
  
  static init(app,configs){
    return new TurtleRouterModule(app,configs)
  }
  
  start(){
    
  }
  
}