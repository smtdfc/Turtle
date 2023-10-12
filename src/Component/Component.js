import { generateKey ,measureTime} from "../utils.js"
import { processDOM } from "./dom.js"
import {update} from "./update.js"

export class TurtleComponent extends HTMLElement {
  constructor() {
    super()
    this.componentID = generateKey()
    window.TURTLE.TURTLE_COMPONENTS[this.tagName] = window.TURTLE.TURTLE_COMPONENTS[this.tagName] ?? {}
    window.TURTLE.TURTLE_COMPONENTS[this.tagName][this.componentID] = this
    this.props = {}
    this.data = {}
    this.refs = {}
    this.states = {}
    this.rerenderDepenedents = null
    this.shouldRerender = true
    this.isRendered = false
    this.component_data = {}
    this.usingShadowDOM = false
    this.template = document.createElement("template")
    if(this.getAttribute("t-props")){
      this.props = window.TURTLE.TURTLE_PROPS[this.getAttribute("t-props")]
      delete window.TURTLE.TURTLE_PROPS[this.getAttribute("t-props")]
      this.removeAttribute("t-props")
    }
      
  }
  
  setState(name,value){
    this.states[name] = value
    if(this.shouldRerender){
      if(this.rerenderDepenedents == null || this.rerenderDepenedents.includes(name)) this.requestRender()
    }
  }
  
  onCreate() {}
  onRemove() {}
  onFirstRender() {}
  onRerender() {}
  onRender() {}
  beforeRender() {}
  start() {}

  async requestRender() {
    if (!this.isRendered) {
      let result = processDOM(this.template.content.childNodes)
      this.refs = result.refs
      this.mem = result.mem
      result.events.forEach(e => {
        let events = window.TURTLE.TURTLE_EVENTS[e.key] ?? {}
        Object.keys(events).forEach(ev => {
          e.node.addEventListener(ev, events[ev])
        })
      })
      
      requestAnimationFrame(()=>{
        this.beforeRender()
        update(this.mem,this)
        this.isRendered = true 
        this.onFirstRender()
        this.onRender()
      })
      let r = this.usingShadowDOM ? this.shadowRoot : this
      r.textContent = ""
      r.appendChild(this.template.content)
    }else{
      requestAnimationFrame(() => {
        this.beforeRender()
        update(this.mem, this)
        this.isRendered = true
        this.onRerender()
        this.onRender()
      })
    }
  }

  async connectedCallback() {
    await this.start()
    await this.onCreate()
    await this.requestRender()
  }

  async disconnectedCallback() {
    await this.onRemove()
  }

}

export function component(name, callback) {
  let $Component = class extends TurtleComponent {
    async start() {
      this.template.innerHTML = await callback.bind(this)(this,this.props)
    }
  }

  window.customElements.define(name, $Component)
}