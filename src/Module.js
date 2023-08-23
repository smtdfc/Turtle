import { generateKey } from "./utils.js"

export class TurtleModule{
  constructor(app){
    this.app = app
    this.data = {}
    this.id = generateKey()
    this.modules = []
  }
  
  use(module){
    let m = new module(this).init(this)
    this.modules.push(m)
    return m
  }
}