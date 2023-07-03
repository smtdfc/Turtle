window.TURTLE_COMPONENTS = {}

function matches(content) {
	return /{{(.*?)}}/g.test(content)
}

function update(context, nodes = [], attrs = []) {
	nodes.forEach((node, idx) => {
		if (node) {
			updateContent(node.node, node.content, context)
		}
	})
	attrs.forEach((attr, idx) => {
		if (attr.node) {
			updateAttr(attr.node, attr.name, attr.value, context)
		} 
	})
}

function updateContent(node, template, data) {
	
	node.textContent = template.replace(/{{(.*?)}}/g, (match) => {
		let expr = match.split(/{{|}}/)[1]
		try {
			
			let value = (new Function(`return ${expr}`).apply(data))
			return value
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
				root:node,
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
		this.shouldRerender = true
		this.isRendered = false
		this.isTurtleComponent = true
		this.states = {}
		this.stateManagers ={}
		this.dependentState = null
		this.data = {}
	}

	setState(name, value) {
		let old = this.states[name]
		this.states[name] = value
		if (this.dependentState == null || this.dependentState.includes(name)) {
			this.requestRender()
		}
		if(this.stateManagers[name]) this.stateManagers[name].events.stateChange(old, value)
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
			this.onFirstRender()
			requestAnimationFrame(() => {
				update(
					this,
					this.reference.refTextNode,
					this.reference.refAttr
				)
				this.isRendered = true
				this.onRender()
			})
		} else {
			if (this.isRendered && this.shouldRerender == true) {
				update(
					this,
					this.reference.refTextNode,
					this.reference.refAttr
				)
				requestAnimationFrame(() => {
					
					this.onRerender()
					this.onRender()
				})
			}
		}
	}
	addStateManager(stateName,stateManager){
		this.stateManagers[stateName] = stateManager
		stateManager.bind(this)
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
		window.TURTLE_COMPONENTS[name] = true
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
		window.TURTLE_COMPONENTS[name] = true
	} catch (e) {
		throw `Unable to initialize component : ${name} !`
	}
	return COMPONENT
}