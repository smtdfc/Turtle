import {initDevMode} from "./dev/dev.js"

if(!window.__TURTLE__.dev){
  window.__TURTLE__.dev = true
  initDevMode()
}

export * from "./index.js"
export * from "./dev/emitter.js"
export * as TurtleDevEvents from "./dev/events.js"