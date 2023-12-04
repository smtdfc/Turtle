import { generateKey } from "../utils.js"
export function props(p) {
  let key = generateKey()
  window.TURTLE.TURTLE_PROPS[key] = p
  return `t-props="${key}"`
}

export function events(e) {
  let key = generateKey()
  window.TURTLE.TURTLE_EVENTS[key] = e
  return `t-event="${key}"`
}

export function ref(name) {
  return `t-ref="${name}"`
}

export function attrs(d) {
  let key = generateKey()
  window.TURTLE.TURTLE_ATTRS[key] = d
  return `t-attrs="${key}"`
}