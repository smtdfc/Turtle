import { render } from '../../../dom/render.js';

/**
 * TurtleRouterModule manages routing in a Turtle application.
 * It handles matching routes, invoking callbacks, and rendering components based on URLs.
 */
export class TurtleRouterModule {

  /**
   * Creates a new TurtleRouterModule instance.
   *
   * @param {Object} app - The Turtle app instance this router is attached to.
   * @param {Object} configs - Configuration for the router, including the root element.
   */
  constructor(app, configs) {
    this.root = configs.element ?? document.createElement("div")
    this._app = app
    this._app.modules.push(this)
    this._app.router = this
    this.routes = {}
    this.matched = null
    this.url = null
    this.params = {}
    this.query = new URLSearchParams()
    this.events = {
      notallow: [],
      notfound: [],
      pagematches: [],
      pageloaded: [],
      pagechange: []
    }
  }

  /**
   * Registers an event listener for a specific router event.
   *
   * @param {string} event - The name of the event (e.g., 'pagechange', 'notfound').
   * @param {function} callback - The function to call when the event is triggered.
   */
  on(event, callback) {
    this.events[event].push(callback)
  }

  /**
   * Unregisters an event listener for a specific router event.
   *
   * @param {string} event - The name of the event.
   * @param {function} callback - The callback function to remove.
   */
  off(event, callback) {
    this.events[event].forEach((fn, idx) => {
      if (fn === callback) {
        this.events[event].splice(idx, 1)
      }
    })
  }

  /**
   * Initializes the TurtleRouterModule.
   *
   * @param {Object} app - The Turtle app instance.
   * @param {Object} configs - Configuration for the router.
   * @returns {TurtleRouterModule} - The initialized router module.
   */
  static init(app, configs) {
    return new TurtleRouterModule(app, configs)
  }

  /**
   * Matches the provided URL against the router's routes.
   *
   * @param {string} url - The URL to match against the defined routes.
   * @returns {Promise<void>} - A promise that resolves when the match is complete.
   */
  async matches(url) {
    let u = new URL(url, window.location.origin)
    url = u.pathname
    this.emitEvent("pagechange", this)
    for (let j = 0; j < Object.keys(this.routes).length; j++) {
      let route = Object.keys(this.routes)[j]
      let configs = this.routes[route]
      let routeSplited = route.split("/")
      let urlSplited = url.split("/")
      let passed = true
      let params = {}

      if (urlSplited.length != routeSplited.length) {
        passed = false
      } else {
        for (let i = 0; i < routeSplited.length; i++) {
          if (urlSplited[i] === undefined) {
            passed = false
          }

          if (routeSplited[i] == "*") {
            continue
          }

          if (routeSplited[i][0] == ":") {
            let name = routeSplited[i].substring(1, routeSplited[i].length)
            params[name] = urlSplited[i]
            continue
          }

          if (routeSplited[i] != urlSplited[i]) {
            passed = false
          }
        }
      }

      if (passed) {

        this.params = params
        this.query = u.searchParams
        this.matched = route
        this.url = url
        let component = new Function()
        if (configs.callback) { await configs.callback() }
        if (configs.protect) {
          let result = await configs.protect()
          if (!result) {
            this.triggerError("not_allow")
            return
          }
        }
        this.emitEvent("pagematches", this)

        if (configs.loader) {
          component = await configs.loader()
        }

        if (configs.component) {
          component = configs.component
        }
        let ctx = this
        let element = this.root
        function renderContent(raw, ...values) {
          element.textContent = ""
          
          element.appendChild(render(ctx, document.createDocumentFragment(), { raw, values }))
        }
        this.emitEvent("pageloaded", this)
        return renderContent`<${component} />`
      }
    }

    this.triggerError("not_found")
  }

  /**
   * Starts the router and listens for changes in the URL.
   */
  start() {
    let started = false
    let path = window.location.hash
    if (path.length == 0) {
      path = "/"
    } else {
      path = path.slice(2)
    }

    window.addEventListener("hashchange", function() {
      if (started) {
        let path = window.location.hash
        if (path.length == 0) {
          path = "/"
        } else {
          path = path.slice(2)
        }

        this.matches(path)
      }

    }.bind(this))

    this.matches(path)
    started = true
  }

  /**
   * Redirects to a new route.
   *
   * @param {string} path - The path to navigate to.
   * @param {boolean} [replace=false] - Whether to replace the current URL or push a new one.
   */
  redirect(path, replace = false) {
    if (!replace) {
      window.location.hash = `!${path}`
    } else {
      window.history.replaceState(null, null, `./#!${path}`)
      this.matches(path)
    }
  }

  /**
   * Emits an event.
   *
   * @param {string} name - The event name.
   * @param {*} data - The data to pass with the event.
   */
  emitEvent(name, data) {
    this.events[name].forEach(fn => {
      fn(data)
    })
  }

  /**
   * Triggers a router error event.
   *
   * @param {string} name - The error event name (e.g., 'not_allow', 'not_found').
   */
  triggerError(name) {
    switch (name) {
      case 'not_allow':
        this.emitEvent("notallow", this)
        break;

      case 'not_found':
        this.emitEvent("notfound", this)
        break;
    }
  }
}