import { render } from '../render/index.js';
import { TurtleRenderContext } from '../render/context.js';
import { TurtleContextManager } from '../context/manager.js';
import { TurtleComponent } from '../component/component.js';
import { getComponentInstance } from '../component/render.js';
import { registerApp } from '../dev/index.js';

export class TurrleApp {
  constructor(configs = {}) {
    this.configs = configs
    this.states = {}
    this.root = null
    this.modules = []
    this.contexts = new TurtleContextManager(this, null)
    this.renderContext = new TurtleRenderContext(this)
    registerApp(this)
  }

  useModule(module, configs = {}) {
    let instance = module.init(this, configs)
    this.modules.push(instance)
    return instance
  }

  useContext(name, context) {
    this.contexts.use(name, context)
  }

  attach(element) {
    if (!(element instanceof HTMLElement)) {
      throw Error(`[Turtle Render Error] Element must be instance of HTMLElement`)
    }

    this.root = element
  }

  fragment(raws, ...values) {
    return render(this.renderContext, { raws, values },this)
  }
  
  renderFragment(raws,...values){
    this.root.textContent = ""
    this.root.appendChild(render(this.renderContext, { raws, values },this))
  }
  
  render(component) {
    if (getComponentInstance(component)) {
      this.root.appendChild(this.fragment` 
      <${component}/>
    `)
    }
  }


}

export function createApp(element, configs = {}) {
  let app = new TurrleApp(configs)
  app.attach(element)
  return app
}