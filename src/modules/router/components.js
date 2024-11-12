import { TurtleComponent, createComponent } from '../../component/component.js';

export class TurtleRouteComponent extends TurtleComponent {
  constructor(props) {
    super(props)
    this.matched = false
  }

  onInit() {
    const [routes] = this.props;

    if (Array.isArray(routes)) {
      this.routes = {};
      routes.forEach(({ component, path }) => {
        if (Array.isArray(path)) {
          path.forEach(p => this.routes[p] = component);
        } else {
          this.routes[path] = component;
        }
      });
    } else if (typeof routes === "object") {
      this.routes = routes;
    }

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
      }
      if (!status) {
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