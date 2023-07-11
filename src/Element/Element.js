import { createEvent, createEventListener, deleteEventListener } from "../Event.js"
import { generateKey, generateError } from "../utils.js"

export class TurtleElement {
	constructor(element) {
		this.key = generateKey()
		if (element instanceof HTMLElement) {
			if (!element.turtle_element) {
				element.turtle_element = {
					key: this.key
				}
			} else {
				this.key = element.turtle_element.key
			}
			this.HTMLElement = element
		} else if (element instanceof TurtleElement) {
			element = element.HTMLElement
			this.HTMLElement = element
			this.key = element.key
		} else {
			generateError("Invalid Element", "The element must be HTMLElement or TurtleElement !")
		}

	}

	setStyle(properties, value, priority = "") {
		this.HTMLElement.style.setProperty(properties, value, priority)
	}

	getStyle(properties) {
		return this.HTMLElement.style.getPropertyValue(properties)
	}

	computedStyle(pseudoElement) {
		return getComputedStyle(this.HTMLElement, pseudoElement)
	}
	
	set id(ID){
		this.HTMLElement.id = ID
	}
	
	get id(){
		return this.HTMLElement.id
	}
	
	get classList(){
		return this.HTMLElement.classList
	}
	
	set val(v) {
		this.HTMLElement.value = v
	}

	get val() {
		return this.HTMLElement.value
	}

	set HTML(html) {
		this.HTMLElement.innerHTML = html
	}

	get HTML() {
		return this.HTMLElement.innerHTML
	}

	set text(t) {
		this.HTMLElement.textContent = t
	}

	get text() {
		return this.HTMLElement.textContent
	}

	get attr() {
		return new TurtleAttrElement(this)
	}

	set checked(state) {
		this.HTMLElement.checked = state
	}

	get checked() {
		return this.HTMLElement.checked
	}

	on(name, callback) {
		this.HTMLElement.addEventListener(name, callback, true)
	}

	removeListener(name, callback) {
		this.HTMLElement.removeEventListener(name, callback, true)
	}

	get childs() {
		return new TurtleListElement(this, this.HTMLElement.children)
	}

	get nodes() {
		return this.HTMLElement.childNodes
	}

	select(query) {
		try {
			let element = this.HTMLElement.querySelector(query)
			if (element == null) {
				generateError("Invalid Element", `Element not found ${query}`)
			}
			return new TurtleElement(element)
		} catch (e) {
			generateError("Selector Error", `Cannot select element by query ${query} !`)
		}
	}

	selectAll(query) {
		try {
			let elements = this.HTMLElement.querySelectorAll(query)
			return new TurtleListElement(elements)
		} catch (e) {
			generateError("Selector Error", `Cannot select all element by query ${query} !`)
		}
	}

	focus() {
		this.HTMLElement.focus()
	}

	click() {
		this.HTMLElement.click()
	}
	addChild(child){
		if(child instanceof HTMLElement){
			this.HTMLElement.appendChild(child)
		}else if(child instanceof TurtleElement){
			this.HTMLElement.appendChild(child.HTMLElement)
		}
	}
}

export class TurtleAttrElement {
	constructor(element) {
		if (element instanceof TurtleElement) {
			this.turtle_element = element
		} else {
			generateError("Invalid Element", "The element must be HTMLElement or TurtleElement !")
		}
		let ctx = this
		this.listenerInited = false
	}

	get(name) {
		this.turtle_element.HTMLElement.getAttribute(name)
	}

	set(name, value) {
		this.turtle_element.HTMLElement.setAttribute(name, value)
	}

	addListener(callback, context = this) {
		let ctx = this
		if (!this.listenerInited) {
			this.observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.type === "attributes") {
						createEvent(`turtle_event_${ctx.turtle_element.key}_ac`, {
							attr: mutation.attributeName,
							newVal: mutation.target.getAttribute(mutation.attributeName)
						}).emit()
					}
				});
			});

			this.observer.observe(this.turtle_element.HTMLElement, {
				attributes: true
			});
			this.listenerInited = true
		}
		createEventListener(`turtle_event_${ctx.turtle_element.key}_ac`, callback, context)
	}

	removeListener(callback) {
		let ctx = this
		deleteEventListener(`turtle_event_${ctx.turtle_element.key}_ac`, callback)
	}
}

export class TurtleListElement {
	constructor(parent, list) {
		this.parent = parent
		this.list = list
	}

	each(callback, context) {
		for (const child of this.list) {
			callback.bind(context)(new TurtleElement(child))
		}
	}

	get length() {
		return this.list.length
	}

	remove(idx) {
		try {
			this.list[idx].remove()
		} catch (e) {
			generateError("Element Error", `Cannot remove element by index : ${idx}`)
		}
	}

	get(idx) {
		try {
			return new TurtleElement(this.list[idx])
		} catch (e) {
			generateError("Element Error", `Cannot get element by index : ${idx}`)
		}
	}
}

export function createElement(name) {
	return new TurtleElement(document.createElement(name))
}