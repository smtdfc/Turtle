import { TURTLE_DEV_EVENTS, devLog } from '../dev/dev.js';
import { render } from '../render/render.js';
import { TurtleRenderContext } from '../render/context.js';

/**
 * Represents the main application for Turtle.
 */
export class TurtleApp {
  /**
   * Creates an instance of TurtleApp.
   * @param {Object} [configs={}] - Optional configurations for the application.
   */
  constructor(configs = {}) {
    this.root = null;
    this.app = this;
    this.configs = configs;
    this.data = {};
    this.contexts = {};
    this.services = {};
    this.modules = [];
    devLog(TURTLE_DEV_EVENTS.APP_INIT, this);
  }

  /**
   * Registers and initializes a module in the Turtle application.
   * @param {Object} module - The module to be registered and initialized.
   * @param {Object} configs - The configuration settings for the module.
   */
  use(module, configs) {
    return module.init(this, configs);
  }

  /**
   * Uses a context in the Turtle application.
   * @param {string} name - The name of the context.
   * @param {TurtleContext} context - The context instance to be used.
   */
  useContext(name, context) {
    if (!(context instanceof TurtleContext)) {
      throw new Error("[Turtle Data Error] Object must be an instance of TurtleContext");
    }
    this.contexts[name] = context;
  }

  /**
   * Adds a service to the application.
   * @param {Object} service - The service to be added.
   * @param {Object} configs - The configuration settings for the service.
   */
  addService(service, configs) {
    
    // Implementation of service addition will go here
  }

  /**
   * Attaches the application to a root HTML element.
   * @param {HTMLElement} element - The HTML element to attach the app to.
   */
  attach(element) {
    this.root = element;
    devLog(TURTLE_DEV_EVENTS.APP_ATTACHED, {
      app: this,
      element
    });
  }

  /**
   * Renders a template into the root element of the application.
   * @param {TemplateStringsArray} raw - The raw template literal.
   * @param {...*} values - The values to be used in the template.
   */
  render(raw, ...values) {
    const context = new TurtleRenderContext(this);
    const template = { raw, values };
    const element = render(document.createDocumentFragment(), template, context, this);

    // Clear existing content and append the new rendered element
    this.root.textContent = "";
    this.root.appendChild(element);
  }
}

/**
 * Creates and initializes a Turtle application.
 * @param {HTMLElement} root - The root element for the application.
 * @param {Object} [configs={}] - Optional configurations for the application.
 * @returns {TurtleApp} - The initialized Turtle application instance.
 */
export function createApp(root, configs = {}) {
  const app = new TurtleApp(configs);
  app.attach(root);
  return app;
}