import { matches } from './parser.js';
import { render } from '../../components/render.js';
export class TurtleRouterModule {
  constructor(app, configs) {
    this.element = configs.element ?? document.createElement("div")
    this.routes = {}
    this.params = {}
    this.events = {
      pagenotfound: [],
      notallow: [],
      routechanged: [],
      loadcontentfailed: []
    }
    this.query = new URLSearchParams()
    this.app = app
    this.matched = null
    app.router = this
    this.currentContext = null
    this.render = render
    this.render = this.render.bind(this)
  }

  static init(app, configs) {
    return new TurtleRouterModule(app, configs)
  }

  async matches(path) {
    if (path.length == 0) path = "/"
    let matched = false
    let url = new URL(path, window.location.origin)
    path = url.pathname
    if (path.length == 0) path = "/"
    for (let i = 0; i < Object.keys(this.routes).length; i++) {
      let pattern = Object.keys(this.routes)[i]
      let result = matches(pattern, path)
      if (result.matched) {
        if(this.currentContext){
          if(this.currentContext.onRouteChange) this.currentContext.onRouteChange()
        }
        matched = true
        let content_fn = {}
        let route_info = this.routes[pattern]
        if (route_info.beforeLoadContent) route_info.beforeLoadContent.bind(this)()
        this.matched = pattern
        this.params = result.params
        this.url = path
        if (route_info.protect) {
          let res = await route_info.protect()
          if (!res) {
            this.triggerEvent("notallow")
            return
          }
        }
        this.query = url.searchParams
        if (route_info.loader) content_fn = await route_info.loader.bind(this)()
        if (route_info.content) content_fn = route_info.content
        if (route_info.onContentLoaded) {
          try {
            route_info.onContentLoaded.bind(this)()
          } catch (err) {
            this.triggerEvent("loadcontentfailed", err)
          }
        }
        
        if (content_fn.template) {
          const context = {
            app: this.app,
            _memories: [],
            _refs: {},
            get refs() {
              return this._refs
            },
            
          }
          
          context.html=render.bind(context)
          this.currentContext = context
          let template = content_fn.template.bind(context)(context, result)
          this.element.textContent = ""
          this.element.appendChild(template)
          if (context.onRender) context.onRender()
        }
        
        if (route_info.callback) { route_info.callback.bind(this)() }
        if (content_fn.configs) {
          let configs = content_fn.configs
          document.title = configs.title ?? document.title
        }
        this.triggerEvent("routechanged")
        break
      }
    }

    if (!matched) {
      this.triggerEvent("pagenotfound")
    }
  }

  on(name, callback) {
    this.events[name].push(callback)
  }

  async redirect(path, replace = false) {
    if (!replace) {
      window.location.hash = path
    } else {
      window.history.replaceState(null, null, `#${path}`)
      path = window.location.hash.slice(1)
      await this.matches(path)
    }
  }

  triggerEvent(name) {
    this.events[name].forEach(callback => {
      callback()
    })
  }


  start() {
    let ctx = this

    window.addEventListener("hashchange", function(e) {
      let path = window.location.hash.slice(1)
      ctx.matches(path)
    })
    
    window.addEventListener("click", function(event) {
      let target = event.target
      if (target.getAttribute("t-redirect")) {
        event.preventDefault()
        let path = target.getAttribute("t-redirect")
        window.location =`#${path}`
      }
    })

    let path = window.location.hash.slice(1)
    this.matches(path)
  }

  createPage(fn, configs) {
    return {
      template: fn,
      configs: configs
    }
  }
}