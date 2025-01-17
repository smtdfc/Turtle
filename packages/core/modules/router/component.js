import { createComponent } from "../../component/base.js"
import { extractParameters } from './extract.js';

export const TurtleRouteComponent = createComponent({
  onInit: function() {
    let [router, routes] = this.props
    this.router = router
    this.routes = routes
    this.component = null
  },

  render: function(component) {
    if (component && this._element) {
      this._element.textContent = ""
      this._element.appendChild(this.router.app.fragment`
            <${component}/>
       `);
    }
  },

  matchesRoute: function(route) {
    for (let pattern in this.routes) {
      let [matched, extractedData] = extractParameters(route, pattern);
      if (matched) {
        return [true, pattern, extractedData];
      }
    }
    return [false, null, null];
  },

  resolve: async function() {

    try {
      let [matched, path, extractedData] = this.matchesRoute(this.router.getCurrentPath());
      if (matched) {
        let component = null
        this.query = extractedData.query;
        this.params = extractedData.slugs;
        let routeInfo = this.routes[path];
        if (routeInfo instanceof Function) component = await routeInfo()
        else component = routeInfo
        if (this.component !== component) {
          this.component = component
        }
        this.render(component)
      }
    } catch (error) {
      throw Error(`Route resolution failed: ${ error.message}`);
    }
  },

  onRender: function() {
    let [router, routes] = this.props
    this.resolve()
    router.on("onchange", () => {
      this.resolve()
    })
  },

  template: function() {
    return this.html``
  }
})