export function initDevMode() {
  if (!window.__TURTLE__) {
    window.__TURTLE__ = {};
  }

  if (!window.__TURTLE__.devMetaData) {
    window.__TURTLE__.devMetaData = {
      components: {},
      apps: {}
    };
  }
}

function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

export function isDevMode() {
  return window.__TURTLE__ && window.__TURTLE__.devMode;
}

export function registerComponent(component) {
  if (!isDevMode()) return;

  const key = generateKey();
  component._turtledevdata = {
    key: generateKey()
  }
  window.__TURTLE__.devMetaData.components[key] = {
    key,
    name: component.constructor.name,
    instance: component
  };

  return key;
}

export function registerApp(app) {
  if (!isDevMode()) return;

  const key = generateKey();
  app._turtledevdata = {
    key: generateKey()
  }
  window.__TURTLE__.devMetaData.apps[key] = {
    key,
    instance: app
  };

  return key;
}

export function getComponentByKey(key) {
  if (!isDevMode()) return null;
  return window.__TURTLE__.devMetaData.components[key] || null;
}

export function getAppByKey(key) {
  if (!isDevMode()) return null;

  return window.__TURTLE__.devMetaData.apps[key] || null;
}

export function removeComponentByKey(key) {
  if (!isDevMode()) return false;

  if (window.__TURTLE__.devMetaData.components[key]) {
    delete window.__TURTLE__.devMetaData.components[key];
    return true;
  }
  return false;
}

export function removeAppByKey(key) {
  if (!isDevMode()) return false;

  if (window.__TURTLE__.devMetaData.apps[key]) {
    delete window.__TURTLE__.devMetaData.apps[key];
    return true;
  }
  return false;
}