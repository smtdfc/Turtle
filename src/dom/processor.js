export function process(root, doc, data, ctx) {

  let childNodes = doc.childNodes
  for (let i = 0; i < childNodes.length; i++) {
    let currentNode = childNodes[i]
    let nodeName = childNodes[i].nodeName
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      if (data.components[nodeName]) {
        let componentElement = document.createElement("turtle-component")
        componentElement._instance = data.components[nodeName]
        root.appendChild(componentElement)
      } else {
        let element = document.createElement(nodeName)

        for (let attr of currentNode.attributes) {
          if (attr.name == "ref") {
            ctx.refs[attr.value] = element
          }else if (attr.name == "t-html") {
            ctx.bindings.push({
              type: "html",
              expr: attr.value,
              element
            })
          } else if (attr.name == "t-text") {
            ctx.bindings.push({
              type: "text",
              expr: attr.value,
              element
            })
          } else {
            element.setAttribute(attr.name, attr.value)
          }
        }

        if (currentNode.childNodes.length > 0) {
          process(element, currentNode, data, ctx)
        }

        root.appendChild(element)
      }
    } else if (currentNode.nodeType === Node.TEXT_NODE) {
      root.appendChild(document.createTextNode(currentNode.textContent))
    }
  }
}