import { TurtleComponent, createComponent } from '../../component/component.js';

export class TurtleRouteComponent extends TurtleComponent {
  constructor(props) {

    super(props)
    this.matched = false

  }

  onCreate() {
    this.routes = this.props[0]
  }

  active() {
    if (this.app.router) {
      let router = this.app.router
      let [status, matched] = router.match(Object.keys(this.routes), router.currentPath())
      if ((status) && !this.matched) {
        this.matched = true
        this.element.appendChild(this.html`
          <${this.routes[matched]}/>
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