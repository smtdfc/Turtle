import { parseContent } from './parser.js';
import { TurtleRenderDirectives } from './directives.js';
import {getComponentInstance,createComponentElementTag} from '../component/render.js';

const directiveNames = Object.keys(TurtleRenderDirectives);
const directiveSelector = directiveNames.map((value) => `[${value}]`).join(",");

export function render(template, context) {
  const values = template.values.map((value) => {
    if (value) {
      
      const componentInstance = getComponentInstance(value, null);
       if (componentInstance) {
         if (context.target.constructor === componentInstance.constructor) {
           throw Error(`Render loop detected for component: ${componentInstance.constructor.name}`);
         }
         return createComponentElementTag(componentInstance, context.target, context.target.app);
       }
    }
    return value;
  });

  const content = String.raw(template.raws, ...values);
  const parsedContent = parseContent(content);


  const elementsWithDirectives = parsedContent.querySelectorAll(directiveSelector);

  for (const element of elementsWithDirectives) {
    applyDirectives(context, element);
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
        TurtleRenderDirectives[directive]?.init(renderContext,attrValue, element);
      } catch (error) {
        console.log(error)
        console.error(`Error applying directive '${directive}':`, error);
      }
      element.removeAttribute(directive);
    }
  });
}