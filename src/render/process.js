import { EventDirective, BindingDirective, HTMLDirective, TextContentDirective, RefDirective } from './directives.js';
import { TurtleComponentRef } from '../component/ref.js';

/**
 * Extracts the name from the directive based on the given prefix.
 *
 * @param {string} name - The name of the directive.
 * @param {string} start - The prefix to extract from the name.
 * @returns {string|null} The extracted name without the prefix, or null if the prefix is not found.
 */
function extractName(name, start) {
  if (name.startsWith(start)) return name.substring(start.length);
  return null;
}

/**
 * Applies a directive based on its name and value to a target element.
 *
 * @param {HTMLElement} target - The target element to which the directive is applied.
 * @param {string} name - The name of the directive.
 * @param {string} value - The value associated with the directive.
 * @param {Object} context - The context in which the directive is applied.
 * @returns {boolean} Returns true if the directive was successfully applied, otherwise false.
 */
function applyDirective(target, name, value, context) {
  let passed = false;
  for (let prefix in directives) {
    const ename = extractName(name, prefix);
    const DirectiveClass = directives[ename != null ? prefix : name];
    if (!DirectiveClass) {
      continue;
    }
    const directiveInstance = new DirectiveClass(target, ename, value, context);
    if (typeof directiveInstance.apply === 'function') {
      directiveInstance.apply();
      passed = true;
    }
    break;
  }
  return passed;
}

// Map of directive prefixes to their corresponding classes
const directives = {
  "tevent-": EventDirective,
  "tbind-": BindingDirective,
  "thtml": HTMLDirective,
  "ttext": TextContentDirective,
  "ref": RefDirective
};

/**
 * Processes attributes of a given node and applies directives accordingly.
 *
 * @param {HTMLElement} target - The target element to process attributes for.
 * @param {Element} node - The node from which to extract attributes.
 * @param {Object} context - The context in which the attributes are processed.
 * @param {Object} data - Additional data to be used during processing.
 */
export function processAttribute(target, node, context, data) {
  for (let attribute of Array.from(node.attributes)) {
    let name = attribute.name;
    let value = attribute.value;
    let isDirective = applyDirective(target, name, value, context);
    if (!isDirective) {
      target.setAttribute(name, value);
    }
  }
}

/**
 * Processes a DOM tree, creating elements and applying directives as needed.
 *
 * @param {HTMLElement} element - The parent element to which new elements are appended.
 * @param {Node} tree - The DOM tree to process.
 * @param {Object} context - The context for processing.
 * @param {Object} data - Additional data, including component mappings.
 * @param {Object} app - The application context for components.
 */
export function process(element, tree, context, data, app) {
  for (let node of Array.from(tree.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      element.appendChild(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (data.components[node.nodeName]) {
        let component = data.components[node.nodeName];
        let componentElement = document.createElement("turtle-component");
        componentElement.attach(app, context.root, component);
        if (node.getAttribute("ref")) {
          context.addRef(
            node.getAttribute("ref"),
            new TurtleComponentRef(componentElement)
          );
        }
        element.appendChild(componentElement);
      } else {
        let newElement = document.createElement(node.tagName);
        processAttribute(newElement, node, context, data);
        if (node.childNodes.length > 0) process(newElement, node, context, data);
        element.appendChild(newElement);
      }
    }
  }
}

