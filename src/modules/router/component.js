import { TurtleComponent, createComponent } from "../../component/component.js"
import { extractParameters } from './extract.js';

export class TurtleRouteComponent extends TurtleComponent {
  onInit() {
    let [router, routes] = this.props
    this.router = router
    this.routes = routes
    this.component = null
  }

  render(component) {
    if (component && this._element) {
      this._element.textContent = ""
      this._element.appendChild(this.router.app.fragment`
            <${component}/>
       `);
    }
  }
  
  matchesRoute(route) {
    for (let pattern in this.routes) {
      let [matched, extractedData] = extractParameters(route, pattern);
      if (matched) {
        return [true, pattern, extractedData];
      }
    }
    return [false, null, null];
  }

  async resolve() {
    
    try {
      let [matched, path, extractedData] = this.matchesRoute(this.router.getCurrentPath());
      if (matched) {
        let component = null
        this.query = extractedData.query;
        this.params = extractedData.slugs;
        let routeInfo = this.routes[path];
        if (routeInfo instanceof Function) component = await routeInfo()
        else component = routeInfo
        if(this.component !== component){
          this.component = component
        }
        this.render(component)
      }
    } catch (error) {
      throw Error(`Route resolution failed: ${ error.message}`);
    }
  }

  onRender() {
    let [router, routes] = this.props
    this.resolve()
    router.on("onchange",()=>{
      this.resolve()
    })
  }
  
  template() {
    return this.html``
  }
}

export const TurtleRoute = createComponent(TurtleRouteComponent)