import {TurtleComponentRef} from '../component/ref.js';

 /***
 * Processes attributes of a given node and applies relevant bindings or actions to the element.
 * 
 * @param {Object} root - The root object containing component methods and event handlers.
 * @param {HTMLElement} element - The DOM element to which attributes will be applied.
 * @param {Element} node - The XML/HTML node from which attributes are read.
 * @param {TurtleRenderContext} context - The rendering context used to manage bindings and references.
 */
function processAttributes(root, element, node, context) {
  let attributes = Array.from(node.attributes);
  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i];

    if (attribute.name === "ref") {
      context._addRef(attribute.value, element);
    }

    else if (attribute.name === "thtml") {
      context._addBinding(attribute.value, {
        type: "property",
        name: "innerHTML",
        target: element
      });
    }

    else if (attribute.name === "ttext") {
      context._addBinding(attribute.value, {
        type: "property",
        name: "textContent",
        target: element
      });
    }

    else if (attribute.name.slice(0, "tbind-".length) === "tbind-") {
      let attrName = attribute.name.substr("tbind-".length);
      context._addBinding(attribute.value, {
        type: "attr",
        name: attrName,
        target: element
      });
    }

    else if (attribute.name.slice(0, "tevent-".length) === "tevent-") {
      let eventName = attribute.name.substr("tevent-".length);
      if (!root[attribute.value]) {
        throw new Error("[Turtle Binding Error] Cannot set event for " + attribute.value);
      }
      element.addEventListener(eventName, root[attribute.value].bind(root));
    }
    
    else{
      element.setAttribute(attribute.name,attribute.value)
    }
  }
}

/**
 * Processes nodes from a parsed document and creates corresponding DOM elements with bindings.
 * 
 * @param {Object} root - The root object containing component methods and event handlers.
 * @param {HTMLElement} rootElement - The root DOM element to append processed elements.
 * @param {Document} doc - The parsed XML/HTML document.
 * @param {Object} data - Data object containing component definitions.
 * @param {TurtleRenderContext} context - The rendering context used to manage bindings and references.
 */
export function process(root, rootElement, doc, data, context) {
  let nodes = Array.from(doc.childNodes);

  for (let i = 0; i < nodes.length; i++) {
    let currentNode = nodes[i];

    if (currentNode.nodeType === Node.ELEMENT_NODE) {

      if (data.components[currentNode.nodeName]) {
        let componentElement = document.createElement("turtle-component");
        componentElement._instance = data.components[currentNode.nodeName];
        componentElement._app = root._app
        componentElement._parent = root
        rootElement.appendChild(componentElement);
        if(currentNode.getAttribute("ref")){
          context._addRef(
            currentNode.getAttribute("ref"),
            new TurtleComponentRef(componentElement)
          )
        }
        continue;
      }

      const element = document.createElement(currentNode.nodeName);

      if (element instanceof HTMLUnknownElement) {
        continue;
      }
      processAttributes(root, element, currentNode, context);
      process(root, element, currentNode, data, context);
      rootElement.appendChild(element);

    }

    if (currentNode.nodeType === Node.TEXT_NODE) {
      rootElement.appendChild(currentNode);
    }
  }
}