import {TurtleModule} from "../Module.js"


function matches(list = {}, route) {
  let routes = Object.keys(list)

  for (var i = 0; i < routes.length; i++) {
    let passed = 0
    let data = {}
    let parsed = parsePath(routes[i])
    if (parsed.length != route.length) continue
    for (var j = 0; j < parsed.length; j++) {
      if (parsed[j][0] == ":") {
        passed++
        let name = parsed[j].substr(1, parsed[j].length)
        data[name] = route[j]
      } else if (parsed[j] == "*" || parsed[j] == route[j]) {
        passed++
        continue
      }
    }
    if (passed == parsed.length) return [true, data, routes[i]]
  }
  return [false, {}]
}

function emitEvent(router, name, data) {
  if (!router.events[name]) router.events[name] = []
  router.events[name].forEach(callback => {
    callback(data)
  })
}

function parsePath(path) {
  let tok = path.split("/")
  tok = tok.filter(t => t != "")
  return tok
}

function resolveRoute(router, url = new URL("/", window.load)) {
  let parsedURL = parsePath(url.pathname)
  let [passed, data, matched] = matches(router.routes, parsedURL)
  let info = {
    matched: matched,
    params: data,
    query: url.searchParams,
    path: url.pathname
  }
  if (passed) {

    let routeConfig = Object.assign(router.routes[matched])
    let component = routeConfig.component ?? null
    router.info = info
    if (routeConfig.protect) {
      let passed = routeConfig.protect({ router, info })
      if (!passed) {
        emitEvent(router, "notallow", { router, info })
        return 
      }
    }

    if (routeConfig.resolver) {
      let signal = routeConfig.resolver({ router, info })
      if (signal) {
        if (signal.redirect) {
          router.redirect(signal.redirect)
        }

        if (signal.changeComponent) {
          component = signal.changeComponent
        }

        if (signal.abort) {
          return
        }

        if (signal.block) {
          emitEvent(router, "notallow", { router, info })
        }

      }
    }

    if (routeConfig.callback) routeConfig.callback({ router, info })
    if (routeConfig.title) document.title = routeConfig.title
    if (component) {
      if (!window.TURTLE.TURTLE_COMPONENTS[component.toUpperCase()]) {
        if (routeConfig.loader) routeConfig.loader({ router, info })
      }
      let $component = document.createElement(component)
      $component.router = {}
      $component.router = {
        router,
        info
      }
      router.element.textContent = ""
      router.element.appendChild($component)
    }

  } else {
    emitEvent(router, "notfound", { router, info })
  }
}

export class RouterModule extends TurtleModule{

  constructor(app) {
    super(app)
  }

init(app){
  this.app.router = this
  return this
}

  define(config) {

    if (config.element) {
      this.element = document.querySelector(config.element)
    } else {
      throw "Invalid element !"
    }

    this.type = config.type || "hash"
    this.info = {}
    this.routes = config.routes ?? {}
    this.events = {
      onRouteMatched: [],
      onRouteChange: []
    }
    
  }

  redirect(path, replace = false) {
    if (this.type == "hash") {
      if (!replace)
        window.location.hash = path
      else{
        window.history.replaceState(null, null, `#${path}`)
        path = window.location.hash.slice(1)
        let url = new URL(path, window.location.origin)
        resolveRoute(this, url)
      }
    }else{
      if(!replace)
        window.history.pushState(null,null,`${path}`)
      else
        window.history.replaceState(null, null, `${path}`)
    }
  }
  on(name, callback) {
    if (!this.events[name]) this.events[name] = []
    this.events[name].push(callback)
  }
  start() {
    let context = this
    if (this.type == "hash") {
      let path = window.location.hash.slice(1)
      let url = new URL(path, window.location.origin)
      resolveRoute(context, url)
    }

    if (this.type == "history") {
      resolveRoute(context, new URL("",window.location.href))
    }
    
    window.addEventListener("click",function(e){
      let target = e.target
      if(target.dataset["tlink"]){
        e.preventDefault()
        let link = target.dataset["tlink"]
        context.redirect(link,target.dataset["treplace"]?true:false)
      }
    })
    
    if (this.type == "hash") {
      window.addEventListener("hashchange", function(e) {
        let path = window.location.hash.slice(1)
        let url = new URL(path, window.location.origin)
        resolveRoute(context, url)
      })
    } else {
      window.addEventListener("popstate", function(e) {
        resolveRoute(context, new URL("",window.location.href))
      })
    }
  }
}