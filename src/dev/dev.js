import { initListener } from './listeners.js';

/**
 * Initializes the Turtle Development Mode.
 * 
 * This function checks if the development mode is enabled in the Turtle framework.
 * If so, it sets up logging for development tools, initializes tracking for apps and components,
 * and activates additional debugging features.
 */
export function initDevMode() {
  if (window.__TURTLE__.dev) {
    console.info("Turtle Development Mode is activated !");
    console.info("In development mode, you can access additional debugging tools and features.");

    // Initialize the development tracking object
    window.__TURTLE_DEV__ = {
      apps: {},
      components: {},
    };

    console.info("Tracking initialized. Use window.__TURTLE_DEV__.apps and window.__TURTLE_DEV__.components to monitor your applications and components.");

    // Initialize event listeners for debugging
    initListener();
  }
}