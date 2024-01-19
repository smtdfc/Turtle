import {TurtleComponent} from './component.js';

function checkAndExtractId(inputString) {
  const regex = /^TurtleComponent_([a-zA-Z0-9]+)$/;
  const match = inputString.match(regex);

  if (match) {
    const id = match[1];
    return id;
  } else {
    return null;
  }
}

export function processAttributes(node, root, context = {}) {
  if (node && root) {
    for (var i = 0; i < node.attributes.length; i++) {
      let attribute = node.attributes[i];
      if (attribute.localName.indexOf('bind-') === 0) {
        let attrName = attribute.localName.substring('bind-'.length);
        if (context.root instanceof TurtleComponent) {
          context.root._memories.push({ type: "attr", attr: attrName, node: root, expr: attribute.value })
          root.setAttribute(attrName, attribute.value);
        }
      } else if (attribute.localName.indexOf('on-') === 0) {
        let eventName = attribute.localName.substring('on-'.length);
        root.addEventListener(eventName, evalInScope(attribute.value, context))
      } else if (attribute.localName == "t-text") {
        if (context.root instanceof TurtleComponent) {
          context.root._memories.push({ type: "text", node: root, expr: attribute.value })
        }
      } else if (attribute.localName == "t-ref") {
        if (context.root instanceof TurtleComponent) {
          context.root._refs[attribute.value] = root
        }
      } else if (attribute.localName == "t-html") {
        if (context.root instanceof TurtleComponent) {
          context.root._memories.push({ type: "html", node: root, expr: attribute.value })
        }
      } else {
        root.setAttribute(attribute.name, attribute.value);
      }
    }
  }
}


export function processing(dom, contents, context) {
  for (let i = 0; i < contents.childNodes.length; i++) {
    let node = contents.childNodes[i]

    if (node.nodeType === Node.ELEMENT_NODE) {
      let name = node.tagName
      let element = document.createElement(node.tagName)
      if (element instanceof HTMLUnknownElement) {
        if (name.indexOf("TurtleComponent_") != -1) {
          let id = checkAndExtractId(name)
          if (id) {
            if (context.data.components[id]) {
              element = document.createElement("turtle-component")
              element.setAttribute("id", id)
              element._controller = context.data.components[id]
              dom.appendChild(element)
            }
          }
        }
      } else {
        processAttributes(node, element, context)
        processing(element, node, context)
        dom.appendChild(element)
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      dom.appendChild(document.createTextNode(node.textContent))
    }
  }

}