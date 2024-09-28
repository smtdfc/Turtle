import { render } from './dom/render.js';
import {TurtleContext} from './context/index.js';

/**
 * Represents a Turtle application that renders content to a specified DOM element.
 */
export class TurtleApp {
  /**
   * Creates an instance of TurtleApp.
   * 
   * @param {HTMLElement|null} [element=null] - The DOM element where the application will be rendered. Defaults to `null`.
   * @param {Object} [configs={}] - Configuration settings for the application. Defaults to an empty object.
   */
  constructor(element = null, configs = {}) {
    this.element = element;
    this.configs = configs;
    this.data = {};
    this.contexts = {}
    this.modules = []
    this._app = this
  }

  useContext(name, context) {
    if(!(context instanceof TurtleContext)){
      throw new Error("[Turtle Data Error] Object must be instance of TurtleContext")
    }
    
    this.contexts[name] = context
  }
  
  
  /**
   * Registers and initializes a module in the Turtle application.
   * 
   * @param {Object} module - The module to be registered and initialized.
   * @param {Object} configs - The configuration settings for the module.
   */
  use(module, configs) {
    return module.init(this, configs);
  }

  /**
   * Renders the application content using the specified template and values.
   * 
   * @param {TemplateStringsArray} raw - The raw template string containing HTML.
   * @param {...any} values - Values to interpolate into the template.
   */
  render(raw, ...values) {
    render(this, this.element, {
      raw,
      values
    });
  }
}

/**
 * Creates a new instance of TurtleApp.
 * 
 * @param {HTMLElement|null} element - The DOM element where the application will be rendered. 
 * @param {Object} [configs={}] - Configuration settings for the application.
 * @returns {TurtleApp} A new instance of TurtleApp.
 */
export function createApp(element, configs = {}) {
  return new TurtleApp(element, configs);
}