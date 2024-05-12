import { TurtleComponent } from '../component/component.js';
import { parseHTML } from './parser.js';
import {process} from './processor.js';

export function render(raw, values,ctx) {
  let data = {
    components: {}
  }
  

  for (let i = 0; i < values.length; i++) {
    
    let key = `turtle-component-${(Math.floor(Math.random() * 999999) * Date.now()).toString(16)}`
    
    if (values[i] instanceof TurtleComponent) {
      data.components[key] = values[i]
      values[i] = key
    } else if (values[i].ins === TurtleComponent) {
      data.components[key] = values[i]()
      values[i] = key
    }
  }
  
  let content = String.raw(raw,...values)
  let doc = parseHTML(content)
  let root = document.createDocumentFragment()
  process(root,doc,data,ctx)
  return root
}