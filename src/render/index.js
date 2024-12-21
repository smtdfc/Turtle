import { parseContent } from './parse.js';
import { directives } from './directives.js';
import { createComponentElementTag, getComponentInstance } from '../component/index.js';

const directiveNames = Object.keys(directives);
const directiveSelector = directiveNames.map((value) => `[${value}]`).join(",");

export function render(renderContext, template,app) {
  const values = template.values.map((value) => {
    const componentInstance = getComponentInstance(value,app);
    if (componentInstance) {
      if (renderContext.target.constructor === componentInstance.constructor) {
        throw Error(`Render loop detected for component: ${componentInstance.constructor.name}`);
      }
      return createComponentElementTag(componentInstance, renderContext.target,app);
    }
    return value;
  });

  const content = String.raw(template.raws, ...values);
  const parsedContent = parseContent(content);

  const elementsWithDirectives = parsedContent.querySelectorAll(directiveSelector);

  for (const element of elementsWithDirectives) {
    applyDirectives(renderContext, element);
  }

  const fragment = document.createDocumentFragment();
  fragment.append(...parsedContent.childNodes);
  return fragment;
}

function applyDirectives(renderContext, element) {
  directiveNames.forEach((directive) => {
    if (element.hasAttribute(directive)) {
      const attrValue = element.getAttribute(directive);
      try {
        directives[directive](renderContext, element, renderContext.target, attrValue);
      } catch (error) {
        console.error(`Error applying directive '${directive}':`, error);
      }
      element.removeAttribute(directive);
    }
  });
}

