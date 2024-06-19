import { generateKey } from "./utils.js"

export class TurtleModule{
  constructor(app){
    this.app = app
    this.data = {}
    this.id = generateKey()
  }
}