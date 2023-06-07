import { TurtleElement, TurtleListElement } from "./Element/Element.js"
import { TurtleListAttribute } from "./Element/ListAttr.js"
import { TurtleSelector } from "./Selector.js"
import { component, TurtleComponent } from "./Component/Component.js"
import { TurtleRequest, TurtleResponse } from "./HTTP.js"
import { TurtleStorage } from "./Storage.js"
import {ClientInfo} from "./Client.js"

const VERSION = "0.0.1"
const DEV = true
window.TURTLE_DEV = DEV
export const version = VERSION
export const Element = TurtleElement
export const ListElement = TurtleListElement
export const ListAttribute = TurtleListAttribute
export const Selector = TurtleSelector
export const createComponent = component
export const Component = TurtleComponent
export const Request = TurtleRequest
export const Response = TurtleResponse
export const Storage = TurtleStorage
export const info = ClientInfo