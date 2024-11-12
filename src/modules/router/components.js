import { TurtleComponent,createComponent } from '../../component/component.js';

export class TurtleRouteComponent extends TurtleComponent {
  constructor(props) {
    
    super(props)
    this.matched = false
    
  }

  onCreate() {
    
    if (typeof this.props[0] == "string") {
      this.routes = [this.props[0]]
    } else {
      this.routes = this.props[0]
    }
    this.component = this.props[1]
    
  }
  
 active() {
    if (this.app.router) {
      let router = this.app.router
      if ((router.match(this.routes, router.currentPath())) && !this.matched) {
        this.matched = true
        this.element.appendChild(this.html`
          <${this.component}/>
        `)
      } else {
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