import { render } from '../../../dom/render.js';

export class TurtleRouterModule {
  constructor(app, configs) {
    this.root = configs.element ?? document.createElement("div")
    this.app = app
    this.app.modules.push(this)
    this.app.router = this
    this.routes = {}
    this.matched = null
    this.url = null
    this.params = {}
    this.query = new URLSearchParams()
    this.events = {
      notallow: [],
      notfound: []
    }
  }

  on(event, callback) {
    this.events[event].push(callback)
  }

  off(event, callback) {
    this.events[event].forEach((fn, idx) => {
      if (fn === callback) {
        this.events[event].splice(idx, 1)
      }
    })
  }

  static init(app, configs) {
    return new TurtleRouterModule(app, configs)
  }

  async matches(url) {
    let u = new URL(url, window.location.origin)
    url = u.pathname
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

        if (configs.loader) {
          component = await configs.loader()
        }

        if (configs.component) {
          component = configs.component
        }
        let element = this.root

        function renderContent(raw, ...values) {
          element.textContent = ""
          
          element.appendChild(render(raw, values, {
            refs: {},
            bindings: [],
            type: "page"
          }))
        }

        return renderContent`<${component} />`
      }
    }

    this.triggerError("not_found")
  }

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
        console.log(path)
        this.matches(path)
      }

    }.bind(this))

    this.matches(path)
    started = true
  }

  redirect(path, replace = false) {
    if (!replace) {
      window.location.hash = `!${path}`
    } else {
      window.history.replaceState(null, null, `./#!${path}`)
      this.matches(path)
    }
  }

  emitEvent(name, data) {
    this.events[name].forEach(fn => {
      fn(data)
    })
  }

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