export class ComponentController {
  constructor(component) {
    this.component = component
  }
  setState(name, value) {
    this.component.states[name] = value

    this.onStateChange(name, value)
    if (!this.component.isStatic) {
      if (this.component.shouldRerender == true && (this.component.rerenderDependentStates == null || this.component.rerenderDependentStates.includes(name))) {
        this.component.requestRender()
      }
    }
  }
  set useShadowDOM(s) {
    if (!this.component.isStatic) {
      if (s) {
        this.component.attackShadow({
          mode: "open"
        })
        this.useShadowDOM = true
      } else {
        this.useShadowDOM = false
      }
    }
  }
  get states() {
    return this.component.states
  }
  ref(name) {
    
      return this.component.ref(name)
    
  }
  onStateChange(stateName, value) {}
  onCreate() {}
  onRemove() {}
  onFirstRender() {}
  onRender() {}
  onRerender() {}
  beforeRender() {}
}