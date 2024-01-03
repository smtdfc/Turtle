export function initComponent(name,fn, context) {
   context.components[name] ={
      fn:fn
   }
}