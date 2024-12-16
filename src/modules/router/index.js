import { extractParameters } from './extract.js';

export class TurtleRouterModule {
  constructor(app, configs = {}) {
    this.app = app;
    this.routes = {};
    this.currentPath = "/";
    this.query = {};
    this.params = {};
    this.mode = configs.mode || "hash";
  }

  static init(app, configs) {
    return new TurtleRouterModule(app, configs);
  }

  addRoute(path, { loader, callback, protect = () => true, component = null }) {
    this.routes[path] = { loader, callback, protect, component };
  }

  initListener() {
    if (this.mode === "history") {
      window.addEventListener("popstate", () => {
        this.currentPath = window.location.pathname;
        this.resolve();
      });
    } else if (this.mode === "hash") {
      window.addEventListener("hashchange", () => {
        this.currentPath = window.location.hash.slice(2) || "/";
        this.resolve();
      });
    }
  }

  navigate(path) {
    if (this.mode === "history") {
      if (this.currentPath !== path) {
        history.pushState({}, "", path);
        this.currentPath = path;
        this.resolve();
      }
    } else if (this.mode === "hash") {
      if (this.currentPath !== path) {
        window.location.hash = `#!${path}`;
        this.currentPath = path;
        this.resolve();
      }
    }
  }

  matchesRoute(route) {
    for (let pattern in this.routes) {
      let [matched, extractedData] = extractParameters(route, pattern);
      if (matched) {
        return [true, pattern, extractedData];
      }
    }
    return [false, null, null];
  }
  
  async resolve() {
    try {
      let [matched, path, extractedData] = this.matchesRoute(this.currentPath);
      if (matched) {
        this.query = extractedData.query;
        this.params = extractedData.slugs;
        let routeInfo = this.routes[path];
        let component = await routeInfo?.loader?.();
        await routeInfo?.callback?.();
        if (routeInfo.protect) {
          if (!routeInfo.protect()) {
            this.emit("notallow");
            return;
          }
        }

        if (!component && routeInfo?.component) {
          component = routeInfo?.component;
        }
        
        
      }
    } catch (error) {
      throw Error("Route resolution failed:", error);
    }
  }

  start() {
    if (this.mode === "history") {
      this.currentPath = window.location.pathname || "/";
    } else if (this.mode === "hash") {
      this.currentPath = window.location.hash.slice(2) || "/";
      if (!window.location.hash) {
        window.location.hash = "!/";
      }
    }
    this.resolve();
    this.initListener();
  }
}