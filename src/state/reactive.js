export class TurtleReactive {
  static async reactive(state, binding) {
    if (binding.type == "prop") {
      binding.element[binding.name] = state.get()
    }
    
    if (binding.type == "callback") {
      binding.callback(binding.element[binding.name], state)
    }
    
    if (binding.type == "attr") {
      binding.element.setAttribute(binding.name, state.get())
    }

    if (binding.type == "context") {
      binding.context.set(binding.key, state.get())
    }
  }
}