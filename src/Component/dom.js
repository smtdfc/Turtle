import { TurtleElement } from "../Element/Element.js"

function matches(content) {
  return /{{(.*?)}}/g.test(content)
}

export function processDOM(nodes) {
  let mem = []
  let refs = {}
  let events = []
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i]
    if (node.nodeType == Node.TEXT_NODE) {
      if (matches(node.textContent)) {
        mem.push({
          node: node,
          temp: node.textContent
        })
      }
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      Array.from(node.attributes).forEach((attr) => {
        if (attr.localName == "t-ref") {
          refs[attr.value] = new TurtleElement(node)
          node.removeAttribute("t-ref")
          return
        }
        if (attr.localName = "t-attrs") {
          let attrs = window.TURTLE.TURTLE_ATTRS[attr.value]
          Object.keys(attrs).forEach(name => {
            node[name] = attrs[name]
          })
          node.removeAttribute("t-attrs")
          return

        }
        if (attr.localName == "t-event") {
          events.push({
            node: node,
            key: attr.value
          })
          node.removeAttribute("t-event")
          return
        }

        if (matches(attr.localName)) {
          mem.push({
            node: node,
            attr: attr.localName,
            temp: attr.value
          })
        }
      })

      let child = processDOM(node.childNodes)
      mem.push(...child.mem)
      let r = child.refs
      refs = { ...refs, ...r }
      events.push(...child.events)
    }
  }

  return {
    mem,
    refs,
    events
  }
}