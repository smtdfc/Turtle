import {render} from '../render/index.js';
import {TurtleRenderContext} from '../render/context.js';

export class TurtleApp{
  constructor(root,configs={}){
    this.root = root 
    this.app = this
    this.configs = configs
    this.modules = []
    this.contexts = {}
    this.renderContext = new TurtleRenderContext(this)
  }
  
  useModule(module,configs={}){
    let res = module.init(this,configs)
    this.module.push(res)
    return res
  }
  
  attach(element){
    if(!(element instanceof HTMLElement)) throw new Error("[Render Error] element must be HTMLElement")
    this.root = element
  }
  
  fragment(raws,...value){
    return  render({raws,values},this.renderContext)
  }
  
  renderFragment(raws,...values){
    let fragment = render({raws,values},this.renderContext)
    this.root.textContent = ""
    this.root.appendChild(fragment)
  }
  
}

export function createApp(root,configs={}){
  return new TurtleApp(root,configs)
}