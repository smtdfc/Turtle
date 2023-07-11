import {TurtleElement} from "../Element/Element.js"
import { processDOM } from "./DOMProcess.js"
import { updateDOM } from "./DOMUpdate.js"
import { generateKey } from "../utils.js"

window.TURTLE_COMPONENTS = {}
export class TurtleComponent extends HTMLElement {
	#refs
	constructor() {
		super()
		this.componentId = generateKey()
		window.TURTLE_COMPONENTS[this.componentId] = this
		this.data = {}
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
	}
	
	set useShadowRoot(s){
		if(s) this.attachShadow({mode:"open"})
	}
	
	ref(name){
		return new TurtleElement(this.#refs.refElementNodes[name])
	}
	
	setState(name, value) {
		this.states[name] = value
		this.onStateChange(name,value)
		
		if(this.shouldRerender){
			if(this.renderDependents == null || this.renderDependents.includes(name)){
				this.requestRender()
			}
		}
	}

	async requestRender() {
		if (!this.isRendered) {
			this.isRendered = true
			this.dom = document.createElement("template")
			this.dom.innerHTML = await this.render()
			this.contents = this.dom.content
			this.#refs = processDOM(this.contents, false)
			let rctx = this.usingShadowDOM ? this.shadowRoot : this
			rctx.textContent = ""
			rctx.appendChild(this.contents)
			this.beforeRender()
			requestAnimationFrame(() => {
				updateDOM(this.#refs, this)
				Promise.all([
					this.onFirstRender(),
					this.onRender()
				])
			})
		} else {
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
	onRemove(){}
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