import { parseContents, process } from '../../component/process.js';
import { matches } from './parser.js';

export class TurtleRouterModule {
   constructor(app, configs) {
      this.element = configs.element ?? document.createElement("div")
      this.routes = {}
      this.params = {}
      this.events = {
         pagenotfound:[],
         notallow:[]
      }
      this.query = new URLSearchParams()
      this.app = app
      this.matched = null
      app.router = this
    
   }

   static init(app, configs) {
      return new TurtleRouterModule(app, configs)
   }

   redirect(path, replace=false){
      window.location.hash = path
      
   }
   
   async matches(path) {
      Object.keys(this.routes).forEach(async pattern => {
         let result = matches(pattern, path)
         if (result.matched) {
            let content_fn = new Function()
            let route_info = this.routes[pattern]
            if (route_info.beforeLoadContent) route_info.beforeLoadContent.bind(this)()
            this.matched = pattern
            this.params = result.params
            this.url = path
            if (route_info.protect) {
               let res = await route_info.protect()
               if(!res){
                  this.triggerEvent("notallow")
                  return
               }
            }
            if (route_info.loader) content_fn = await route_info.loader.bind(this)
            if (route_info.content) content_fn = route_info.content.bind(this)
            if (route_info.onContentLoaded) route_info.onContentLoaded.bind(this)()
            if (route_info.callback) { await route_info.callback.bind(this)() }
            let template = await content_fn(this, result)
            template = parseContents(template)
            process(template, this.element, {
               app: this.app,
               _memories: []
            })
         }else{
            this.triggerEvent("pagenotfound")
         }

      })
   }

   on(name, callback ){
      this.events[name].push(callback)
   }
   
   triggerEvent(name){
      this.events[name].forEach(callback=>{
         callback()
      })
   }
   
   
   start() {
      let ctx = this
      window.addEventListener("hashchange", function(e) {
         let path = window.location.hash.slice(1)
         ctx.matches(path)
      })
      
      this.matches("/")
   }

}