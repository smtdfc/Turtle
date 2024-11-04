import { emitDevEvent } from '../dev/emitter.js';
import * as TURTLE_DEV_EVENTS from '../dev/events.js';

import { render } from '../render/render.js';
import { TurtleRenderData } from '../render/data.js';
import { TurtleContextManagement, TurtleContext } from '../context/context.js';


 /**
 * Class representing the main application for the Turtle library.
 */
export class TurtleApp {
  /**
   * Creates an instance of TurtleApp.
   * @param {Object} [configs={}] - Configuration options for the app.
   */
  constructor(configs = {}) {
    this.root = null;
    this.configs = configs;
    this._contexts = {};
    this.modules = [];
    this.contexts = new TurtleContextManagement(null, this);
    emitDevEvent(TURTLE_DEV_EVENTS.APP_INIT, this);
  }

  /**
   * Initializes and uses a specified module.
   * @param {Object} module - The module to be initialized.
   * @param {Object} [configs] - Configuration options for the module.
   * @returns {*} The result of the module's initialization.
   */
  useModule(module, configs) {
    return module.init(this, configs);
  }

  /**
   * Retrieves a context by its name.
   * @param {string} name - The name of the context.
   * @returns {TurtleContext|null} The context associated with the given name, or null if not found.
   */
  getContext(name) {
    return this.contexts.get(name);
  }

  /**
   * Attaches a context to the app by name.
   * @param {string} name - The name of the context.
   * @param {TurtleContext} context - An instance of TurtleContext to attach.
   * @throws {Error} Throws an error if the context is not an instance of TurtleContext.
   */
  useContext(name, context) {
    if (!(context instanceof TurtleContext)) {
      throw new Error('[Turtle Data Error] Context must be an instance of TurtleContext');
    }
    this.contexts.set(name, context);
  }

  /**
   * Attaches the specified HTML element as the root for rendering.
   * @param {HTMLElement} element - The HTML element to use as the root.
   * @throws {Error} Throws an error if the element is not an instance of HTMLElement.
   */
  attach(element) {
    emitDevEvent(TURTLE_DEV_EVENTS.APP_ATTACHED, this);
    if (element instanceof HTMLElement) {
      this.root = element;
    } else {
      throw new Error('[Turtle Render Error] Element must be an instance of HTMLElement');
    }
  }

  /**
   * Renders the provided raw content and values into the root element.
   * @param {TemplateStringsArray} raw - A template string containing the static parts of the template.
   * @param {...*} values - Values to be interpolated into the template.
   * @throws {Error} Throws an error if the root element is not attached.
   */
  render(raw, ...values) {
    if (!this.root) {
      throw new Error('[Turtle Render Error] Root element is not attached. Please attach a root element before rendering.');
    }

    this.root.textContent = "";
    this.root.appendChild(render(document.createDocumentFragment(), { raw, values }, new TurtleRenderData(this), this));
  }
}