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
          refs[attr.value] = node
          node.removeAttribute("t-ref")
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
      refs = { ...refs,...r }
      events.push(...child.events)
    }
  }

  return {
    mem,
    refs,
    events
  }
}