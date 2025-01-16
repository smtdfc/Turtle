export * from "./app/index.js"
export * from "./component/base.js"
export * from "./context/index.js"
export * from "./modules/index.js"
export * from "./features/index.js"


if (!window.__TURTLE__) {
  window.__TURTLE__ = {
    devMode: false,
    version: "3",
    _apps: {},
    _components: {},
    _contexts: {}
  }
}