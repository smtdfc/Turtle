import { TurtleRenderData } from './data.js';
import { TurtleComponent } from '../component/component.js';
import { parseHTML } from './parser.js';
import { process } from './process.js';

/**
 * Renders a template by processing its raw HTML and inserting values into it.
 *
 * @param {HTMLElement} element - The parent element to which the rendered content will be appended.
 * @param {TemplateStringsArray} template - The template containing the raw HTML and associated values.
 * @param {TurtleRenderData} [context=new TurtleRenderData()] - The context for rendering, defaulting to a new instance.
 * @param {Object|null} [app=null] - The application context, optional parameter.
 * @returns {HTMLElement} The parent element after rendering the template.
 */
export function render(element, template, context = new TurtleRenderData(), app = null) {
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

  process(element, tree, context, data, app);

  return element;
}