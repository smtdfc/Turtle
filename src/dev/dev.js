export const TURTLE_DEV_EVENTS = {
  COMPONENT_CREATE: "COMPONENT_CREATE",
  COMPONENT_ATTACHED: "COMPONENT_ATTACHED",
  COMPONENT_RENDER: "COMPONENT_RENDER",
  COMPONENT_DESTROYED: "COMPONENT_DESTROYED",
  COMPONENT_UPDATE: "COMPONENT_UPDATE",
  APP_INIT: "APP_INIT",
  APP_ATTACHED: "APP_ATTACHED"
};

window.__TURTLE_DEV__ = {
  apps: [],
  components: []
};

window.addEventListener("turtledev", function(event) {
  let eventInfo = event.detail;
  switch (eventInfo.event) {
    case TURTLE_DEV_EVENTS.APP_INIT:
      __TURTLE_DEV__.apps.push(eventInfo.data);
      break;
    
    case TURTLE_DEV_EVENTS.COMPONENT_ATTACHED:
      __TURTLE_DEV__.components.push(eventInfo.data)
      break
  }
});

/**
 * Logs development events if the Turtle dev mode is enabled.
 * 
 * @param {string} event - The type of event to log (e.g., "COMPONENT_INIT", "APP_ATTACHED").
 * @param {Object} data - The data related to the event, which could include information about the app or component.
 * @returns {Promise<void>} - Resolves when the event has been dispatched.
 */
export async function devLog(event, data) {
  if (!window.__TURTLE__.dev) return;

  window.dispatchEvent(new CustomEvent("turtledev", {
    detail: {
      event,
      data
    }
  }));
}
