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

  createReducer(state, callback) {
    let context = this
    return function(value) {
      if (state) {
        context.setState(state, callback(value,context.states[state]))
      }

    }
  }
  
  get scopes(){
    if(this.component.app)
     return this.component.app.scopes || {}
    else
      return {}
  }
  
  get states() {
    return this.component.states
  }

  get props() {
    return this.component.props
  }

  get data() {
    return this.component.data
  }

  set useShadowDOM(s) {
    if (!this.component.isStatic) {
      if (s) {
        this.component.attachShadow({
          mode: "open"
        })
        this.component.usingShadowDOM = true
      } else {
        this.component.usingShadowDOM = false
      }
    }
  }

  requestRender() {
    this.component.requestRender()
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