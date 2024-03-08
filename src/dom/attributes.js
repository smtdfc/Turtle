function evalInScope(js, contextAsScope) {
  return new Function(`return ${js}`).call(contextAsScope);
}

export function processAttributes(node, root, context = {}, scope) {
  if (node && root) {
    for (var i = 0; i < node.attributes.length; i++) {
      let attribute = node.attributes[i];
      if (attribute.localName.indexOf('bind-') === 0) {
        let attrName = attribute.localName.substring('bind-'.length);
        context._memories.push({ type: "attr", attr: attrName, node: root, expr: attribute.value })
        root.setAttribute(attrName, attribute.value);
      } else if (attribute.localName.indexOf('on-') === 0) {
        let eventName = attribute.localName.substring('on-'.length);
        root.addEventListener(eventName, evalInScope(attribute.value, scope))
      } else if (attribute.localName == "t-text") {
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
