/**
 * Class representing a service for a Turtle application.
 */
export class TurtleAppService {
  /**
   * Creates an instance of TurtleAppService.
   * 
   * @param {string} alias_name - The alias name for the service.
   * @param {Object} app - The instance of the Turtle application.
   */
  constructor(alias_name, app) {
    this.app = app; // Reference to the Turtle application instance
    this.alias_name = alias_name; // Alias name for the service
    this.app.services[alias_name] = this; // Register the service in the application
  }

  /**
   * Retrieves another service by its name.
   * 
   * @param {string} name - The name of the service to retrieve.
   * @returns {Object|null} The service instance if found, or null if not found.
   */
  callService(name) {
    return this.app.services[name] || null; // Return the requested service or null
  }

  /**
   * Retrieves a context by its name from the application.
   * 
   * @param {string} name - The name of the context to retrieve.
   * @returns {Object|null} The context if found, or null if not found.
   */
  getContext(name) {
    return this.app.contexts[name] || null; // Return the requested context or null
  }
}