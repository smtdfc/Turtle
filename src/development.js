import * as devModeFeatures from './dev/index.js';

if (!window.__TURTLE__.devMode) {
  window.__TURTLE__.devMode = true
  window.__TURTLE_DEV_FEATURES__ = devModeFeatures 
  devModeFeatures.initDevMode()
}

export * from './index.js';
export const TURTLE_DEV_FEATURES= devModeFeatures