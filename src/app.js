import {parseContents,process} from './component/process.js';
import {initComponent} from './component/component.js';

export class TurtleApp{
   constructor(root){
      this.root = root
      this.data = {}
      this.components = {}
      this.modules = []
   }
   
   use(module,configs ={}){
      this.modules.push(module.init(this,configs))
   }
   
   render(contents ){
      this.root.textContent = ""
      contents = parseContents(contents)
      process(contents,this.root,{
         app:this,
         _memories:[]
      })
      
   }
   
   createComponent(name,fn){
      initComponent(name,fn,this)
   }
   
   
}

export function createApp(root) {
   return new TurtleApp(root)
}

