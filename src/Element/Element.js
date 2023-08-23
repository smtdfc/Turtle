import { TurtleListElement } from "./ListElement.js"
import { generateKey } from "../utils.js"
export class TurtleElement {
  constructor(element) {
    if (element instanceof HTMLElement) {
      element.turtle = element.turtle ?? {}
      if (!element.turtle.key) {
        element.turtle.key = generateKey()
      }
    } else {
      element = element.HTMLElement
    }
    this.HTMLElement = element
  }

  get parent() {
    return new TurtleElement(this.HTMLElement.parentElement)
  }

  get firstChild() {
    return new TurtleElement(this.HTMLElement.firstElementChild)
  }

  get lastChild() {
    return new TurtleElement(this.HTMLElement.lastElementChild)
  }

  get previousSibling() {
    return new TurtleElement(this.HTMLElement.previousElementSibling)
  }

  get nextSibling() {
    return new TurtleElement(this.HTMLElement.previousElementSibling)
  }

  get id() {
    return this.HTMLElement.id
  }

  set id(ID) {
    this.HTMLElement.id = ID
  }

  get classList() {
    return this.HTMLElement.classList
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

  set val(value) {
    this.HTMLElement.value = value
  }

  get val() {
    return this.HTMLElement.value
  }

  set checked(state) {
    this.HTMLElement.checked = state
  }

  get checked() {
    return this.HTMLElement.checked
  }

  set disabled(state) {
    this.HTMLElement.disabled = state
  }

  get disabled() {
    return this.HTMLElement.disabled
  }

  get attrs() {
    return this.HTMLElement.attibutes
  }

  get styles() {
    return this.HTMLElement.style
  }

  get childNodes() {
    return this.HTMLElement.childNodes
  }

  computedStyle(pseudoElement) {
    return getComputedStyle(this.HTMLElement, pseudoElement)
  }

  click() {
    this.HTMLElement.click()
  }

  focus() {
    this.HTMLElement.focus()
  }

  remove() {
    this.HTMLElement.remove()
  }

  addChild(child) {
    if (child instanceof HTMLElement) {
      child = new TurtleElement(child)
    }
    this.HTMLElement.appendChild(child.HTMLElement)
  }

  select(query) {
    let result = this.HTMLElement.querySelector(query)
    if (!result) {
      throw `Invaild HTMLElement by query : ${query}`
    }
  }

  selectAll(query) {
    let result = this.HTMLElement.querySelectorAll(query)
    return new TurtleListElement(this, result)
  }

  on(event, callback) {
    this.HTMLElement.addEventListener(event, callback)
  }

  off(event, callback) {
    this.HTMLElement.removeEventListener(event, callback)
  }
  
}