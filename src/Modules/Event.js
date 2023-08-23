import {TurtleModule} from "../Module.js"

window.TURTLE_EVENTS = {}

export class TurtleEvent {
  constructor(name, data) {
    this.name = name
    this.data = data
  }

  emit() {
    let listeners = window.TURTLE_EVENTS[this.name]
    if (!listeners) {
      return
    }

    for (var idx in listeners) {
      listeners[idx].callback.bind(listeners[idx].context)(this.data)
    }
  }
}

export class EventModule extends TurtleModule {
  constructor(app) {
    super(app)
  }

  init(app) {
    this.app.router = this
    return this
  }
  
  emit(name, data) {
    return new TurtleEvent(name, data)
  }
  
  on(name, callback, context = this) {
    if (!window.TURTLE_EVENTS[name]) window.TURTLE_EVENTS[name] = []
    window.TURTLE_EVENTS[name].push({
      callback: callback,
      context: context
    })
  
  }
  
  off(name, callback) {
    if (!window.TURTLE_EVENTS[name]) window.TURTLE_EVENTS[name] = []
    let listeners = window.TURTLE_EVENTS[name]
    for (var idx in listeners) {
      if (listeners[idx].callback === callback) {
        window.TURTLE_EVENTS[name].splice(idx, 1)
      }
    }
  }
  
  deleteAllEventListener(name) {
    window.TURTLE_EVENTS[name] = []
  }
}

