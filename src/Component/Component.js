function matches(content) {
	return /{{(.*?)}}/g.test(content)
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

function parseNode(nodes, t) {
	let refTextNode = []
	let refAttr = []
	let refNode = {}
	Array.from(nodes.childNodes).forEach((node => {
		if (node.nodeType == Node.ELEMENT_NODE) {
			Array.from(node.attributes).forEach((attr) => {
				if (matches(attr.value)) {
					refAttr.push({
						node: node,
						name: attr.localName,
						value: attr.value
					})
				}
				if (attr.localName == "ref") {
					refNode[attr.value] = node
				}
			})
			let ref = parseNode(node)
			refAttr = [...refAttr, ...ref.refAttr]
			refNode = { ...refNode, ...ref.refNode }
			refTextNode = [...refTextNode, ...ref.refTextNode]
		} else if (node.nodeType == Node.TEXT_NODE && matches(node.textContent)) {
			refTextNode.push({
				node: node,
				content: node.textContent
			})
		}
	}))
	return {
		refTextNode,
		refAttr,
		refNode
	}
}

export class TurtleComponent extends HTMLElement {
	constructor() {
		super()
		this.ref = {}
		this.isRendered = false
		this.isTurtleComponent = true
		this.states = {}
		this.dependentState = []
	}

	setState(name, value) {
		let old = this.states[name]
		this.states[name] = value
		if (this.dependentState == null || this.dependentState.include(name)) {
			this.requestRender()
		}
		this.onStateChange(name, old, value)
	}

	props(name) {
		return this.getAttribute(name)
	}

	getRef(name) {
		return this.reference.refNode[name]
	}

	requestRender() {
		this.beforeRender()
		if (!this.isRendered) {
			this.vdom = document.createElement("template")
			this.vdom.innerHTML = this.render()
			this.reference = parseNode(this.vdom.content, this.k)
			this.after(this.vdom.content)
			this.remove()
			requestAnimationFrame(() => {
				update(
					this,
					this.reference.refTextNode,
					this.reference.refAttr
				)
				this.onFirstRender()
				this.onRender()
			})
		} else {
			requestAnimationFrame(() => {
				update(
					this,
					this.reference.refTextNode,
					this.reference.refAttr
				)
				this.onRerender()
				this.onRender()
			})
		}
	}

	onFirstRender() {}
	onRerender() {}
	onRender() {}
	onStateChange() {}
	onReady() {}
	beforeRender() {}
	connectedCallback() {
		this.requestRender()
		this.onReady()
	}
}

export function define(name, component) {
	component.componentName = name
	try {
		window.customElements.define(name, component)
	} catch (e) {
		throw `Unable to initialize component : ${name} !`
	}
	return component
}

export function create(name, options) {
	const COMPONENT = class extends TurtleComponent {
		constructor() {
			super()
			if (options.shadow) this.shadow = options.shadow
		}
		onReady() {
			if (options.onReady) options.onReady.apply(this)
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
	COMPONENT.componentName = name
	try {
		window.customElements.define(name, COMPONENT)
	} catch (e) {
		throw `Unable to initialize component : ${name} !`
	}
	return COMPONENT
}