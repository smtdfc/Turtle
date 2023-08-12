function matches(content) {
  return /{{(.*?)}}/g.test(content)
}

export function processDOM(dom, child = false, freeze = false) {
  let refTextNodes = []
  let refEvents = []
  let refElementNodes = {}
  let refAttrs = []
  let nodes = Array.from(dom.childNodes)
  for (let i in nodes) {
    let node = nodes[i]
    let parent = node.parentNode
    if (node.nodeType === Node.TEXT_NODE && !freeze) {
      if (matches(node.textContent)) {
        refTextNodes.push({
          node: node,
          parent: parent,
          content: node.textContent,
        })
      }
    }

    if (node.nodeType == Node.ELEMENT_NODE) {
      if (node.childNodes.length > 0) {
      
        let refs = processDOM(node, true, freeze)
        refTextNodes.push(...refs.refTextNodes)
        refAttrs.push(...refs.refAttrs)
        refEvents.push(...refs.refEvents)
        let en = refs.refElementNodes
        refElementNodes = { ...refElementNodes, ...en }
      }
      Array.from(node.attributes).forEach((attr) => {
        


        if (!freeze && matches(attr.value)) {
          refAttrs.push({
            node: node,
            name: attr.localName,
            value: attr.value,
            attr: attr,
            parent: parent
          })
        }

        if (attr.localName == "ref") {
          node.removeAttribute("ref")
          refElementNodes[attr.value] = node
        }

      })


    }
  }
  return {
    refTextNodes,
    refAttrs,
    refElementNodes,
    refEvents
  }
}