import { TurtleRenderContext } from './context.js';
import { TurtleComponent } from '../component/component.js';
import { parseHTML } from './parser.js';
import { process } from './process.js';

/**
 * Renders a template into a specified element, creating a DOM tree
 * based on the provided template and context.
 *
 * @param {HTMLElement} element - The target element where the rendered content will be appended.
 * @param {Object} template - The template containing raw HTML and values to be injected.
 * @param {TurtleRenderContext} [context=new TurtleRenderContext()] - The rendering context for the operation.
 * @returns {HTMLElement} The target element with the rendered content.
 */
export function render(element, template, context = new TurtleRenderContext(),app=null) {
  let raw = template.raw; // Raw HTML string from the template
  let values = template.values; // Values to be inserted into the raw HTML
  let data = {
    components: {} // Object to hold components being rendered
  };

  for (let i = 0; i < values.length; i++) {
    let key = `turtle-component-${(Math.floor(Math.random() * 999999) * Date.now()).toString(16)}`;
    if (values[i]) {
      if (values[i] instanceof TurtleComponent) {
        data.components[key] = values[i]; // Store the component
        values[i] = key; // Replace component with its key in values
      } else if (values[i].instance === TurtleComponent) {
        data.components[key] = values[i]({}); // Call the instance function if it's a component
        values[i] = key; // Replace instance with its key
      }
    }
  }

  let content = String.raw(raw, ...values);
  let tree = parseHTML(content);
  console.log(tree)
  console.log(content)
  process(element, tree, context, data,app);

  return element;
}