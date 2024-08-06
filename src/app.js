import { render } from './dom/render.js';

export class TurtleApp {
  constructor(root) {
    this.root = root
    this.data = {}
    this.modules = []

  }

  use(module, opts) {
    return module.init(this, opts)
  }
  
  render(raw, ...values) {
    let ctx = {
      type: "app",
      refs: {},
      exprBindings: [],
      statesBindings:{}
    }

    let dom = render(raw, values, ctx)
    this.root.textContent = ""
    this.root.appendChild(dom)
  }
}

export function createApp(element) {
  return new TurtleApp(element)
}