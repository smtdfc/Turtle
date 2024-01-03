import { parseContents, process } from './process.js';
import {TurtleComponentState} from './states.js';

function evalInScope(js, contextAsScope) {
   return new Function(`with (this) { return (${js}); }`).call(contextAsScope);
}


class TurtleBaseComponent extends HTMLElement {
   constructor() {
      super()
      this.states = {}
      this.app = null
      this._memories = []
      this.props = []
      this._refs = {}
      this.template = ""
      this.fn = new Function()
      this.onRender = new Function()
      this.onUpdate = new Function()
      this.onCreate = new Function()
      this.onDestroy = new Function()
   }
   
   get refs(){
      return this._refs
   }
   
   createState(value){
      let state = new TurtleComponentState(value,this)
      return state
   }

   requestRender() {
      let contents = parseContents(this.template)
      process(contents, this, this)

      for (let i = 0; i < this._memories.length; i++) {
         let d = this._memories[i]
         if (d.type == "attr") {
            d.node.setAttribute(
               d.attr,
               evalInScope(d.expr, this)
            )
         }

         if (d.type == "text") {
            d.node.textContent = evalInScope(d.expr, this)
         }

         if (d.type == "html") {
            d.node.innerHTML = evalInScope(d.expr, this)
         }
      }
      
      this.onRender.bind(this)()

   }

   forceUpdate() {
      for (let i = 0; i < this._memories.length; i++) {
         let d = this._memories[i]
         if (d.type == "attr") {
            d.node.setAttribute(
               d.attr,
               evalInScope(d.expr, this)
            )
         }

         if (d.type == "text") {
            d.node.textContent = evalInScope(d.expr, this)
         }

         if (d.type == "html") {
            d.node.innerHTML = evalInScope(d.expr, this)
         }
      }
      
      this.onUpdate.bind(this)()
   }

   connectedCallback() {
      this.onCreate.bind(this)()
      this.template = this.fn.bind(this)(this, ...this.props)
      this.requestRender()
   }
   
   disconnectedCallback(){
      this.onDestroy.bind(this)()
   }
   


}

window.customElements.define("turtle-component", TurtleBaseComponent)