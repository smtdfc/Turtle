import { TurtleContextManagement, TurtleContext } from '../context/context.js';

/**
 * Represents a service that manages contexts and methods for an entity.
 */
export class TurtleService {
  /**
   * Creates an instance of TurtleService.
   *
   * @param {Object} entity - The entity that this service will manage.
   */
  constructor(entity) {
    this.entity = entity;
    this.methods = {};
    this._contexts = {};
    this.contexts = new TurtleContextManagement(this.entity, this);
  }

  /**
   * Uses a context by name and sets it in the service.
   *
   * @param {string} name - The name of the context.
   * @param {TurtleContext} context - The context to set, must be an instance of TurtleContext.
   * @throws {Error} Throws an error if the context is not an instance of TurtleContext.
   */
  useContext(name, context) {
    if (!(context instanceof TurtleContext)) {
      throw new Error('[Turtle Data Error] Context must be an instance of TurtleContext');
    }
    this.contexts.set(name, context);
  }

  /**
   * Retrieves a context by name.
   *
   * @param {string} name - The name of the context to retrieve.
   * @returns {TurtleContext|null} The context associated with the given name, or null if not found.
   */
  getContext(name) {
    return this.contexts.get(name);
  }

  /**
   * Defines a method with a name and a callback.
   *
   * @param {string} name - The name of the method to define.
   * @param {Function} callback - The callback function to be executed when the method is called.
   */
  define(name, callback) {
    this.methods[name] = callback.bind(this);
  }

  /**
   * Calls and returns all defined methods.
   *
   * @returns {Object} An object containing all defined methods.
   */
  call() {
    return this.methods;
  }
}