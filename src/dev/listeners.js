import * as TurtleDevEvents from './events.js';

/**
 * Initializes the event listener for Turtle development events.
 * This function listens for the "turtledev" custom event and processes 
 * the details according to the event type.
 */
export async function initListener() {
  window.addEventListener("turtledev", function(event) {
    let details = event.detail;
    let eventName = details.name;
    let data = details.data;
    let ID = (Math.floor(Math.random() * 99999999) * Date.now()).toString(32);

    switch (eventName) {
      case TurtleDevEvents.APP_INIT:
        if (!data._turtle_dev_id) {
          data._turtle_dev_id = ID;
          data._turtle_dev_data = {
            type: "app",
            verify: true,
            status: "init",
            target: data
          };
        }
        window.__TURTLE_DEV__.apps[data._turtle_dev_id] = data;
        break;

      case TurtleDevEvents.COMPONENT_INIT:
        if (!data._turtle_dev_id) {
          data._turtle_dev_id = ID;
          data._turtle_dev_data = {
            type: "component",
            verify: true,
            status: "init",
            target: data
          };
        }
        window.__TURTLE_DEV__.components[data._turtle_dev_id] = data;
        break;

      default:
        // Uncomment to throw an error for unknown dev events
        // throw "[Turtle Dev Error] Unknown dev event!";
    }
  });
}