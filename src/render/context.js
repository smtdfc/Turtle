import { TurtleState } from '../state/index.js';

function parseKeyValueString(input) {
  return input ?
    input.split(',').reduce((result, pair) => {
      const [key, value] = pair.split(':').map(str => str.trim());
      if (key) result[key] = value || null;
      return result;
    }, {}) : {};
}

export class TurtleRenderContext {
  constructor(target) {
    this.target = target
    this.refs = {}
  }

  addHtmlBind(element, state) {

    if (!this.target[state]) {
      this.target[state] = new TurtleState(this.target)
    }

    this.target[state].bindings.push({
      type: "prop",
      name: "innerHTML",
      element
    })

    element.innerHTML = this.target[state].get()
  }
  
  addRef(element, refName) {
    this.refs[refName] = element
  }
  
  addValueBind(element, state) {

    if (!this.target[state]) {
      this.target[state] = new TurtleState(this.target)
    }

    this.target[state].bindings.push({
      type: "prop",
      name: "value",
      element
    })

    element.value = this.target[state].get()
  }

  addTextBind(element, state) {

    if (!this.target[state]) {
      this.target[state] = new TurtleState(this.target)
    }

    this.target[state].bindings.push({
      type: "prop",
      name: "textContent",
      element
    })

    element.textContent = this.target[state].get()
  }

  addClassNameBind(element, state) {
    if (!this.target[state]) {
      this.target[state] = new TurtleState(this.target)
    }

    this.target[state].bindings.push({
      type: "prop",
      name: "className",
      element
    })

    element.className = this.target[state].get()
  }

  addModelBind(element, state) {

    if (!this.target[state]) {
      this.target[state] = new TurtleState(this.target)
    }


    element.addEventListener("input", () => {
      this.target[state].set(element.value)
    })
  }

  async addEventsBind(element, value) {
    let events = parseKeyValueString(value)
    for (let name in events) {
      element.addEventListener(name, (event) => {
        if (!this.target[events[name]]) {
          throw Error(`Event handler not defined ! (@${name}->${this.target.constructor.name}:${events[name]})`)
        }
        this.target[events[name]](event)
      })
    }
  }

}