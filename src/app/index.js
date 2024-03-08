import {render} from '../dom/render.js';

export class TurtleApp {
  constructor(root) {
    this.root = root
    this.data = {}
    this.modules = []
    this.html = render.bind(this)
  }

  use(module,configs) {
    this.modules.forEach(m => {
      if (m === module) throw `Module already exists in this app !`
    })
    
    if (!module.init) {
      throw `Cannot find init function of module `
    } else {
      module.init(this,configs)
      this.modules.push(module)
    }
  }

  render(content) {
    this.root.appendChild(content.root)
  }
}

export function createApp(rootElement) {
  return new TurtleApp(rootElement)
}