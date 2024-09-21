import { TurtleRenderContext } from './context.js';
import { TurtleComponentCaller } from '../component/caller.js';
import { TurtleComponent } from '../component/component.js';
import { parseHTML } from './parser.js';
import { process } from './processor.js';

/**
 * Renders a template into a DOM element, processing components and bindings as specified.
 * 
 * @param {Object} root - The root object containing component methods and event handlers.
 * @param {HTMLElement} rootEle - The DOM element to which the rendered content will be appended.
 * @param {TemplateStringsArray} template - A template literal object containing raw HTML and dynamic values.
 * @param {TurtleRenderContext} [context=new TurtleRenderContext()] - The rendering context used to manage bindings and references.
 * @returns {HTMLElement} The DOM element with the rendered content.
 */
export function render(root, rootEle, template, context = new TurtleRenderContext()) {
  let raw = template.raw;
  let values = template.values;
  let data = {
    components: {}
  };

  for (let i = 0; i < values.length; i++) {
    let key = `turtle-component-${(Math.floor(Math.random() * 999999) * Date.now()).toString(16)}`;
    if (values[i]) {
      if (values[i] instanceof TurtleComponentCaller) {
        data.components[key] = values[i];
        values[i] = key;
      } else if (values[i].ins === TurtleComponent) {
        data.components[key] = values[i]();
        values[i] = key;
      }
    }
  }

  let content = String.raw(raw, ...values);
  let doc = parseHTML(content);

  process(root, rootEle, doc, data, context);

  return rootEle;
}