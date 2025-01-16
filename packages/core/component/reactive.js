export class TurtleComponentReactive{
  static react(dependent,context, bindings,value) {
    for (let binding of bindings) {
      let bindInfo = binding.bind 
      if(bindInfo.type=="function") bindInfo.fn(binding.target,value)
      if(bindInfo.type == "property") binding.target[bindInfo.name] = value
      if(bindInfo.type == "attr") binding.target.setAttribute(bindInfo.name,value)
    }
  }
}