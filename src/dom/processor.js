function getSubstringAfterPrefix(str1, str2) {
  if (str1.startsWith(str2)) {
    return str1.substring(str2.length);
  } else {
    return null;
  }
}

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
          } else if (attr.name == "t-html") {
            ctx.exprBindings.push({
              type: "html",
              expr: attr.value,
              element
            })
          } else if (attr.name == "t-text") {
            ctx.exprBindings.push({
              type: "text",
              expr: attr.value,
              element
            })
          }else if(getSubstringAfterPrefix(attr.name,"tevt-")){
            let eventName = getSubstringAfterPrefix(attr.name,"tevt-")
            ctx.events.push({
              element,
              event:eventName,
              fn:attr.value
            })
          } else if (getSubstringAfterPrefix(attr.name, "tbind-") != null) {
            let attrName = getSubstringAfterPrefix(attr.name, "tbind-")
            if (getSubstringAfterPrefix(attr.value, "@") != null) {
              let stateName = getSubstringAfterPrefix(attr.value, "@")
              if (!ctx.statesBindings[stateName]) {
                ctx.statesBindings[stateName] = [{
                  type: "attr",
                  attr: attrName,
                  element
                }]
              } else {
                ctx.statesBindings[stateName].push({
                  type: "attr",
                  attr: attrName,
                  element
                })
              }
            } else {
              ctx.exprBindings.push({
                type: "attr",
                attr: attrName,
                expr: attr.value,
                element
              })
            }
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