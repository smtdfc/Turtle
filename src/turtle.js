import { TurtleElement, TurtleListElement } from "./Element/Element.js"
import { TurtleListAttribute } from "./Element/ListAttr.js"
import { TurtleSelector } from "./Selector.js"
import { create,define,TurtleComponent } from "./Component/Component.js"
import { TurtleRequest, TurtleResponse } from "./HTTP.js"
import { TurtleStorage } from "./Storage.js"
import {ClientInfo} from "./Client.js"
import {createEvent,createEventListener,deleteEventListener,deleteAllEventListener} from "./Event.js"
import {initRouter,redirect,setRouterEventListener,startRouter} from "./Router/index.js"
const VERSION = "0.0.1"
const DEV = true
window.TURTLE_DEV = DEV
export const version = VERSION
export const Element = TurtleElement
export const ListElement = TurtleListElement
export const ListAttribute = TurtleListAttribute
export const Selector = TurtleSelector
export const createComponent = create
export const registerComponent = define
export const Component = TurtleComponent
export const Request = TurtleRequest
export const Response = TurtleResponse
export const Storage = TurtleStorage
export const info = ClientInfo
export const Router ={
	init:initRouter,
	redirect:redirect,
	on:setRouterEventListener,
	start:startRouter
}

export const Event ={
	emit:createEvent,
	on:createEventListener,
	delete:deleteEventListener,
	deleteAll:deleteAllEventListener
}

export function render(element,html){
	if(element instanceof HTMLElement){
		element.innerHTML = html
	}else if(element instanceof TurtleElement){
		element.HTML = html
	}else{
		throw "Invalid element !"
	}
}