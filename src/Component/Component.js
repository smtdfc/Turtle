import { TurtleElement } from "../Element/Element.js"
import { processDOM } from "./DOMProcess.js"
import { updateDOM } from "./DOMUpdate.js"
import { generateKey } from "../utils.js"
import { ComponentController } from "./Controller.js"
window.TURTLE_COMPONENTS = {}
window.TURTLE_COMPONENTS_PROPS = {}

export class TurtleComponent extends HTMLElement {
  #refNodes
  constructor() {
    super()
    this.componentID = generateKey()
    this.states = {}
    this.props = {}
    this.data = {}
    this.shouldRerender = true
    this.rerenderDependentStates = null
    this.usingShadowDOM = false
    this.template = document.createElement("template")
    let propsKey = this.getAttribute("props")
    if (propsKey) {
      this.props = window.TURTLE_COMPONENTS_PROPS[propsKey]
      delete window.TURTLE_COMPONENTS_PROPS[propsKey]
      this.removeAttribute("props")
    }
    this.isRendered = false
    this.refNodes = {}
    this.controller = new ComponentController(this)
  }


  ref(name) {
    return new TurtleElement(this.#refNodes.refElementNodes[name])
  }



  async requestRender() {
    if (!this.isRendered) {
      this.isRendered = true
      this.contents = this.template.content
      this.#refNodes = processDOM(this.contents, false, this.freeze)

      if (!this.freeze) {
        let rctx = this.usingShadowDOM ? this.shadowRoot : this
        rctx.textContent = ""
        rctx.appendChild(this.contents)
      } else {
        this.after(this.contents)
        this.remove()
      }

      await this.controller.beforeRender()

      
      requestAnimationFrame(() => {

        updateDOM(this.#refNodes, this.controller)

        Promise.all([
					this.controller.onFirstRender(),
					this.controller.onRender()
				])
      })
    } else {
      if (this.freeze) {
        throw "Cannot re-render this component"
      }
      await this.controller.beforeRender()
      requestAnimationFrame(() => {
        updateDOM(this.#refNodes, this.controller)
        Promise.all([
					this.controller.onRerender(),
					this.controller.onRender()
				])
      })
    }
  }

  async connectedCallback() {
    this.template.innerHTML = await this.start.bind(this.controller)(this.controller)
    await this.controller.onCreate()
    await this.requestRender()
  }

  async disconnectedCallback() {
    await this.controller.onRemove()
  }
}

export class TurtleStaticComponent extends HTMLElement {
  #refNodes
  constructor() {
    super()
    this.componentID = generateKey()
    this.states = {}
    this.props = {}
    this.data = {}
    this.template = document.createElement("template")
    let propsKey = this.getAttribute("props")
    if (propsKey) {
      this.props = window.TURTLE_COMPONENTS_PROPS[propsKey]
      delete window.TURTLE_COMPONENTS_PROPS[propsKey]
      this.removeAttribute("props")
    }

    this.isStaticComponent = true
    this.controller = new ComponentController(this)
  }

  ref(name) {
    return new TurtleElement(this.#refNodes.refElementNodes[name])
  }

  async requestRender() {
    await this.controller.beforeRender()
    this.contents = this.template.content
    this.#refNodes = processDOM(this.contents, false, this.freeze)
    this.after(this.contents)
    await this.controller.beforeRender()
    requestAnimationFrame(() => {
      updateDOM(this.#refNodes, this.controller)
      Promise.all([
    	  this.controller.onFirstRender(),
    		this.controller.onRender()
    	])
    })
    this.remove()
  }

  async connectedCallback() {
    this.template.innerHTML = await this.start.bind(this.controller)(this.controller)
    await this.controller.onCreate()
    await this.requestRender()
  }
}

export function createComponent(name, callback) {
  const COMPONENT = class extends TurtleComponent {}
  COMPONENT.prototype.start = callback
  try {
    window.customElements.define(name, COMPONENT)
  } catch (err) {
    throw "Cannot create new Turtle Component !"
  }
}


export function createStaticComponent(name, callback) {
  const COMPONENT = class extends TurtleStaticComponent {

  }
  COMPONENT.prototype.start = callback
  try {
    window.customElements.define(name, COMPONENT)
  } catch (err) {
    throw "Cannot create new Turtle Component !"
  }
}

export function props(data) {
  let propKey = generateKey()
  window.TURTLE_COMPONENTS_PROPS[propKey] = data
  return propKey
}