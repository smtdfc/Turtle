import { TurtleElement } from "../Element/Element.js"
import { processDOM } from "./DOMProcess.js"
import { updateDOM } from "./DOMUpdate.js"
import { generateKey } from "../utils.js"

window.TURTLE_COMPONENTS = {}
window.TURTLE_COMPONENTS_PROPS = {}
export class TurtleComponent extends HTMLElement {
  #refs
  constructor() {
    super()
    this.componentId = generateKey()
    window.TURTLE_COMPONENTS[this.componentId] = this
    this.data = {}
    this.freeze = false
    this.isTurtleComponent = true
    this.isRendered = false
    this.shouldRerender = true
    this.renderDependents = null
    this.states = {}
    this.#refs = {
      textNodes: [],
      attrs: [],
      nodes: []
    }
    this.props = window.TURTLE_COMPONENTS_PROPS[this.getAttribute("props")]
    delete window.TURTLE_COMPONENTS_PROPS[this.getAttribute("props")]
    this.removeAttribute("props")
  }

  set useShadowRoot(s) {
    if (s) this.attachShadow({ mode: "open" })
  }

  ref(name) {
    return new TurtleElement(this.#refs.refElementNodes[name])
  }

  setState(name, value) {
    this.states[name] = value
    this.onStateChange(name, value)

    if (this.shouldRerender) {
      if (this.renderDependents == null || this.renderDependents.includes(name)) {
        if(!this.freeze) this.requestRender()
      }
    }
  }

  async requestRender() {
    if (!this.isRendered) {
      this.isRendered = true
      this.dom = document.createElement("template")
      this.dom.innerHTML = await this.render()
      this.contents = this.dom.content
      this.#refs = processDOM(this.contents, false,this.freeze)
      
      
      if(!this.freeze){
        let rctx = this.usingShadowDOM ? this.shadowRoot : this
        rctx.textContent = ""
        rctx.appendChild(this.contents)
      }else{
        this.after(this.contents)
        this.remove()
      }
      
      this.beforeRender()
      requestAnimationFrame(() => {
        updateDOM(this.#refs, this)
        Promise.all([
					this.onFirstRender(),
					this.onRender()
				])
      })
    } else {
      
      if (this.freeze) {
        throw "Cannot re-render this component"
      }
      this.beforeRender()
      requestAnimationFrame(() => {
        updateDOM(this.#refs, this)
        Promise.all([
					this.onRerender(),
					this.onRender()
				])
      })
    }
  }

  onCreate() {}
  onDestroy() {}
  onStateChange() {}
  beforeRender() {}
  onFirstRender() {}
  onRerender() {}
  onRender() {}
  render() {}

  connectedCallback() {

    this.onCreate()
    this.requestRender()
  }
  disconnectedCallback() {
    this.onRemove()
  }
  onRemove() {}
}

export function createComponent(name, options) {

  const $Component = class extends TurtleComponent {
    render() {
      return (options.render ?? new Function()).bind(this)()
    }
    beforeRender() {
      return (options.beforeRender ?? new Function()).bind(this)()
    }
    onRender() {
      return (options.onRender ?? new Function()).bind(this)()
    }
    onRerender() {
      return (options.onRerender ?? new Function()).bind(this)()
    }
    onFirstRender() {
      return (options.onFirstRender ?? new Function()).bind(this)()
    }
    onCreate() {
      return (options.onCreate ?? new Function()).bind(this)()
    }
    onStateChange(...args) {
      return (options.onStateChange ?? new Function()).bind(this)(...args)
    }

    onRouteChange(...args) {
      return (options.onRouteChange ?? new Function()).bind(this)(...args)
    }
    onRemove(...args) {
      return (options.onRemove ?? new Function()).bind(this)(...args)
    }
  }


  try {
    window.customElements.define(name, $Component)

  } catch (e) {
    throw `Cannot create component : ${name}`
  }
}

export function props(data) {
  let propKey = generateKey()
  window.TURTLE_COMPONENTS_PROPS[propKey] = data
  return propKey
}