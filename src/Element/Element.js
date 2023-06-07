import {TurtleListAttribute} from "./ListAttr.js"
export class TurtleElement {
  constructor(element) {
    this.element = element
  }

  set HTML(html) {
    this.element.innerHTML = html
  }
  get HTML() {
    return this.element.innerHTML
  }
  set text(t) {
    this.element.textContent = t
  }
  get text() {
    return this.element.textContent
  }
  set val(value) {
    this.element.value = value
  }
  get val() {
    return this.element.value
  }
  set checked(state) {
    this.element.checked = state
  }
  get checked() {
    return this.element.checked
  }
  set disable(state) {
    this.element.disabled = state
  }
  get disable() {
    return this.element.disabled
  }
  set id(ID) {
    this.element.id = ID
  }
  get id() {
    return this.element.id
  }
  get classList(){
    return this.element.classList
  }
  get styles(){
    return this.element.style
  }
  get attr(){
    return new TurtleListAttribute(this,this.element.attributes)
  }
  focus() {
    this.element.focus()
  }

  click() {
    this.element.click()
  }

  destroy() {
    this.element.remove()
  }

  on(event, callback) {
    this.element.addEventListener(event, callback)
  }
  
  get child(){
    return new TurtleListElement(this.element.children)
  }
  
  get firstChild(){
    return new TurtleElement(this.element.firstElementChild)
  }
  
  get lastChild(){
    return new TurtleElement(this.element.lastElementChild)
  }
  
  select(query,idx= 0){
    let result = this.element.querySelectorAll(query)[idx]
    if (!result) {
      throw `Cannot find element by query : '${query}' !`
    }
    return new TurtleElement(result)
  }
  
  selectAll(query){
    let result = this.element.querySelectorAll(query)
    return new TurtleListElement(result)
  }
}

export class TurtleListElement{
  constructor(elements){
    this.elements = elements
  }
  
  get length(){
    return this.elements.length
  }
  
  index(idx){
    return new TurtleElement(this.elements[idx])
  }
  
  each(callback){
    for (var element of this.elements) {
      callback(this.elements[element])
    }
  }

}