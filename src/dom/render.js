import { TurtleComponentInstance } from '../component/index.js';
import { TurtleMemorizeContext } from './memorize.js';
import { parserContent } from './parser.js';
import {processAttributes} from './attributes.js';
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



function processing(root, contents, context, data, scope) {
  for (let i = 0; i < contents.childNodes.length; i++) {
    let node = contents.childNodes[i]

    if (node.nodeType === Node.ELEMENT_NODE) {
      let name = node.tagName
      
      let element = document.createElement(node.tagName)
      if (element instanceof HTMLUnknownElement) {
        
        if (name.indexOf("TurtleComponent_") != -1) {
          let id = checkAndExtractId(name)
          
          if (id) {
            if (data.components[id]) {
              element = document.createElement("turtle-component")
              element.setAttribute("id", id)
              element._controller = data.components[id]
              root.appendChild(element)
            }
          }
        }
      } else {
        processAttributes(node, element, context, scope)
        processing(element, node, context)
        root.appendChild(element)
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      root.appendChild(document.createTextNode(node.textContent))
    }
  }

}

export function render(str, ...values) {
  let renderData = {
    components: {},
  }
  
  for (let i = 0; i < values.length; i++) {
    let value = values[i]
    let key = (Math.floor(Math.random() * 99999) * Date.now()).toString(16)
    if (value instanceof Function && value.instance === TurtleComponentInstance) {
      renderData.components[key] = value([])
      values[i] = `TurtleComponent_${key}`
    }

    if (value instanceof TurtleComponentInstance) {
      renderData.components[key] = value
      values[i] = `TurtleComponent_${key}`
    }
  }

  let root = document.createDocumentFragment()
  let context = new TurtleMemorizeContext(this)
  let content = parserContent(String.raw(str, ...values))
  processing(root, content, context, renderData,this)
  return {
    root,
    context,
    content,
    refs:context._refs
  }
}

export function attach(element, content){
  element.textContent = null
  element.appendChild(content.root)
}