function evalInScope(js, contextAsScope) {
   return new Function(`with (this) { return (${js}); }`).call(contextAsScope);
}

export function parseContents(contents) {
   let xmlDoc = new DOMParser().parseFromString(
      `<root>${contents}</root>`,
      "text/xml"
   )

   return xmlDoc.querySelector("root")
}

export function processAttributes(node, root, context = {}) {
   if (node && root) {
      for (var i = 0; i < node.attributes.length; i++) {
         let attribute = node.attributes[i];
         if (attribute.localName.indexOf('bind-') === 0) {
            let attrName = attribute.localName.substring('bind-'.length);
            context._memories.push({ type: "attr", attr: attrName, node: root, expr: attribute.value })
            root.setAttribute(attrName, attribute.value);
         }else if (attribute.localName.indexOf('on-') === 0) {
            let eventName = attribute.localName.substring('on-'.length);
            root.addEventListener(eventName,evalInScope(attribute.value,context))
         }  else if (attribute.localName == "t-text") {
            context._memories.push({ type: "text", node: root, expr: attribute.value })
         } else if (attribute.localName == "t-ref") {
            context._refs[attribute.value] = root
         } else if (attribute.localName == "t-html") {
            context._memories.push({ type: "html", node: root, expr: attribute.value })
         } else {
            root.setAttribute(attribute.name, attribute.value);
         }
      }
   }
}


export function process(contents, root, context) {
   for (let i = 0; i < contents.childNodes.length; i++) {
      let node = contents.childNodes[i]
      if (node.nodeType === Node.ELEMENT_NODE) {
         let element = document.createElement(node.localName)
         if (element instanceof HTMLUnknownElement) {
            if (context.app.components[node.localName]) {
               let component = document.createElement("turtle-component")
               component.setAttribute("name", node.localName)
               component.app = context.app
               component.fn = context.app.components[node.localName].fn
               if (node.hasAttribute("t-props")) {
                  component.props = window.TURTLE_DERECTIVES[node.getAttribute("t-props")]
               }
               root.appendChild(component)
            }
         } else {
            processAttributes(node, element, context)
            process(node, element, context)
            root.appendChild(element)
         }
      }

      if (node.nodeType === Node.TEXT_NODE) {
         root.appendChild(document.createTextNode(node.textContent))
      }
   }
}