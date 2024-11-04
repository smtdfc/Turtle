/**
 * Emits a development event for the Turtle framework.
 *
 * This function creates and dispatches a custom event named "turtledev" 
 * if the development mode is activated. The event includes the specified 
 * event name and associated data as its detail.
 *
 * @param {string} name - The name of the event to emit.
 * @param {*} data - The data associated with the event.
 */
export function emitDevEvent(name, data) {
  if (!window.__TURTLE__.dev) return;

  window.dispatchEvent(new CustomEvent("turtledev", {
    detail: {
      name,
      data
    }
  }));
}