import { TurtleComponent, createComponent } from '../../component/component.js';

export class TurtleRouteComponent extends TurtleComponent {
  constructor(props) {
    super(props)
    this.matched = false
  }

  onInit() {
    if ( this.props[0] instanceof Array) {
      this.routes = {}
      this.props[0].forEach(route => {
        
        let component = route.component
        if (route.path instanceof Array) {
          route.path.forEach(path => {
            console.log()
            this.routes[path] = component
          })
        } else {
          this.routes[route.path] = component
        }
      })
      console.log(this.routes)
      return
    }
    if (typeof this.props[0] == "object") {
      this.routes = this.props[0]
    }
  }

  active() {
    if (this.app.router) {
      let router = this.app.router
      let [status, matched] = router.match(Object.keys(this.routes), router.currentPath())
      console.log(status,matched)
      if ((status) && !this.matched) {
        this.matched = true
        this.element.appendChild(this.html`
          <${this.routes[matched]}/>
        `)
      }
      if(!status){
        this.matched = false
        this.element.textContent = ""
      }
    }
  }

  onRender() {
    this.active()
    if (this.app.router) {
      this.app.router.on("pagechange", this.active.bind(this))
    }
  }

  template() {
    return this.html``
  }
}


export const TurtleRoute = createComponent(TurtleRouteComponent)