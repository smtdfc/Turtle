import { TurtleElement } from "../Element/Element.js"

function updateContent(node, template, data) {
	node.textContent = template.replace(/{{(.*?)}}/g, (match) => {
		let expr = match.split(/{{|}}/)[1]
		try {
			return (new Function(`return ${expr}`)).apply(data)
		} catch (err) {
			if (window.TURTLE_DEV) {
				document.body.innerHTML = `
				<h5 style="color:red">Error when render content of  component  : "..  {{${expr}}}.."</h5>
				<pre style="color:red ; overflow-x:scroll; max-width:98%;">${err.stack}</pre>
			`

				throw "err"
			}
			return "?"
		}
	})
}

function updateAttr(node, attrName, template, data) {

	node.setAttribute(attrName, template.replace(/{{(.*?)}}/g, (match) => {
		let expr = match.split(/{{|}}/)[1]
		try {
			return (new Function(`return ${expr}`)).apply(data)
		} catch (err) {
			if (window.TURTLE_DEV) {
				document.body.innerHTML = `
				<h5 style="color:red">Error in expression  : "..  {{${expr}}}.."</h5>
				<pre style="color:red; overflow-x:scroll ; max-width:98%;">${err.stack}</pre>
			`
				throw "err"
			}
			return "?"
		}
	}))
}


function matches(content) {
	return /{{(.*?)}}/g.test(content)
}

function check(nodes, root = document.createElement("div")) {
	let refNode = []
	let refAttr = []
	let refEle = {}
	Array.from(nodes).forEach(node => {
		if (node.nodeType == Node.TEXT_NODE && matches(node.textContent)) {
			refNode.push({
				node: node,
				root: root,
				content: node.textContent
			})
			//render(node, node.textContent, {})
		} else if (node.nodeType == Node.ELEMENT_NODE) {
			Array.from(node.attributes).forEach((attr) => {
				if (matches(attr.value)) {
					refAttr.push({
						node: node,
						name: attr.localName,
						value: attr.value
					})
				}
				if(attr.localName == "ref"){
					refEle[attr.value] = node
				}
			})
			let res = check(node.childNodes, node)
			refNode.push(...res[0])
			refAttr.push(...res[1])
			refEle = {
				...refEle, 
				...res[2]
			}
		}
	})

	return [refNode, refAttr,refEle]
}

function update(context, nodes = [], attrs = []) {
	nodes.forEach((node, idx) => {

		if (node.root.isConnected) {
			updateContent(node.node, node.content, context)
		} else {
			delete nodes[idx]
		}
	})

	attrs.forEach((attr, idx) => {
		if (attr.node.isConnected) {
			updateAttr(attr.node, attr.name, attr.value, context)
		} else {
			delete attrs[idx]
		}
	})

}

export class TurtleComponent extends HTMLElement {
	constructor() {
		super()
		this._refTextNodes = []
		this._refAttributes = []
		this._refElements = {}
		this.isRendered = false
		this._states = {}
		this.dependentState = null
	}
	prop(name){
		return this.getAttribute(name)
	}
	render() {}
	onMount() {}
	beforeRender() {}
	onRender(){}
	onUnmount() {}
	ref(name){
		return new TurtleElement(this._refElements[name])
	}
	onChangeState(...args) {}
	 async requestRender() {
		this.beforeRender()
		if (!this.isRendered) {
			this.virtualDOM = document.createElement("template")
			this.virtualDOM.innerHTML = this.render()
			let res = check(this.virtualDOM.content.childNodes, this.virtualDOM.content)
			this._refTextNodes = res[0]
			this._refAttributes = res[1]
			this._refElements = res[2]
			this.isRendered = true
			this.after(this.virtualDOM.content)
			this.remove()
		}
		
		requestAnimationFrame(()=>{
			update(this,this._refTextNodes, this._refAttributes)
			this.onRender()
		})
	}

	setState(name, value) {
		let old = this._states[name]
		this._states[name] = value
		this.onChangeState(name, old, value)
		if (this.dependentState == null || this.dependentState.includes(name)) {
			this.requestRender()
		}
	}

	connectedCallback() {
		this.onMount()
		this.requestRender()
	}
	
	disconnectCallback(){
		this.onUnmount()
	}
	

}
export function component(name, options) {
	const COMPONENT = class extends TurtleComponent {
		constructor() {
			super()
			if (options.shadow) this.shadow = options.shadow
		}
		onMount() {
			if (options.onMount) options.onMount.apply(this)
		}
		onUnmount() {
			if (options.onUnmount) options.onUnmount.apply(this)
		}
		beforeRender() {
			if (options.beforeRender) options.beforeRender.apply(this)
		}
		onRender() {
			if (options.onRender) options.onRender.apply(this)
		}
		onChangeState(...args) {
			if (options.onChangeState) options.onChangeState.apply(this, ...args)
		}
		render() {
			return (options.render ?? new Function()).apply(this)
		}
	}

	try {
		window.customElements.define(name, COMPONENT)
	} catch (e) {
		throw `Unable to initialize component : ${name} !`
	}
}