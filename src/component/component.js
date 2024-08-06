import { TurtleState } from './state.js';
import { render } from '../dom/render.js';

export class TurtleComponent {
  constructor() {
    this._element = null
    this.props = {}
    this.refs = {}
    this.exprBindings = []
    this.statesBinding = {}
    this.states = {}
    this.events = []
    this.dependencies = []
  }

  async _eventSetup() {
    for (let i = 0; i < this.events.length; i++) {
      let info = this.events[i]
      console.log(info)
      if (!this[info.fn]) {
        throw `The method ${info.fn} required for event ${info.event} has not been defined !`
      } else {
        info.element.addEventListener(info.event, this[info.fn].bind(this))
      }
    }
  }

  _render() {
    this.beforeRender()
    this._element.textContent = ""
    this._element.appendChild(this.template())
    this.afterRender()
    Object.keys(this.statesBinding).forEach(name => {
      this._updateWithState(name)
    })
    for (let i = 0; i < this.exprBindings.length; i++) {
      let str = this.exprBindings[i].expr
      let value = eval(str)
      if (this.exprBindings[i].type == "html") {
        this.exprBindings[i].element.innerHTML = value
      }

      if (this.exprBindings[i].type == "text") {
        this.exprBindings[i].element.textContent = value
      }
    }
    this._eventSetup()
    this.onRender()
  }

  _updateWithState(name) {
    if (this.statesBinding[name]) {
      this.statesBinding[name].forEach(ref => {
        if (!this.states[name]) {
          throw `State ${name} has not been initialized !`
        }
        if (ref.type == "html") {
          ref.element.innerHTML = this.states[name].val
        }

        if (ref.type == "text") {
          ref.element.textContent = this.states[name].val
        }

        if (ref.type == "attr") {
          ref.element.setAttribute(ref.attr, this.states[name].val)
        }
      })
    }
  }

  _update() {
    for (let i = 0; i < this.exprBindings.length; i++) {
      let value = eval(this.exprBindings[i].expr)
      if (this.exprBindings[i].type == "html") {
        this.exprBindings[i].element.innerHTML = value
      }

      if (this.exprBindings[i].type == "text") {
        this.exprBindings[i].element.textContent = value
      }
    }
  }

  onCreate() {}
  onDestroy() {}
  onRender() {}
  onUpdate() {}
  beforeRender() {}
  afterRender() {}
  beforeUpdate() {}
  afterUpdate() {}
  template() {}
  html(raw, ...values) {
    let ctx = {
      type: "component",
      refs: this.refs,
      exprBindings: [],
      statesBindings: {},
      events: [],
    }

    let dom = render(raw, values, ctx)
    this.refs = Object.assign({}, this.refs, ctx.refs)
    this.exprBindings.push(...ctx.exprBindings)
    this.statesBinding = Object.assign({}, this.statesBinding, ctx.statesBindings)
    this.events.push(...ctx.events)
    return dom
  }

  disableStateReact(name) {}
  enableStateReact(name) {}
  initState(name, value, reaction = true) {
    this.states[name] = new TurtleState(this, value, name, reaction)
  }

  setState(name, value) {
    if (!this.states) {
      this.states[name] = new TurtleState(this, value, name)
    } else {
      this.beforeUpdate()
      this.states[name].value = value
      this.afterUpdate()
      this.onUpdate()
    }
  }

  getState(name) {
    return this.states[name].val
  }

  addUpdateDenpendent(state) {
    this.dependencies.push(state.key)
  }
}

export class TurtleComponentCaller {
  constructor(component, props) {
    this.component = component
    this.props = props
  }

  call() {
    let component = new this.component()
    component.props = this.props
    return component
  }

}

export function createComponent(_constructor) {

  function fn(...props) {
    return new TurtleComponentCaller(_constructor, props)
  }

  fn.ins = TurtleComponent
  return fn
}