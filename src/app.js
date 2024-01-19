
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
   
}

export function createApp(root) {
   return new TurtleApp(root)
}

