import { generateKey } from '../utils/generate.js';
import { render } from '../render/index.js';
import { TurtleRenderContext } from '../render/context.js';
import { TurtleStateManager } from './state.js';
import {TurtleComponentReactive} from "./reactive.js"

export class TurtleComponent {
  constructor(configures, props) {
    this.props = props
    this.configures = configures
    this.onRender = configures.onRender?.bind(this) ?? new Function();
    this.onInit = configures.onInit?.bind(this) ?? new Function();
    this.onCreate = configures.onCreate?.bind(this) ?? new Function();
    this.onDestroy = configures.onDestroy?.bind(this) ?? new Function();
    this.observers = configures.observers ?? {};
    this.forwardRef = configures.forwardRef ?? {};
    this.app = null;
    this.element = null;
    this.parent = null;
    this.renderContext = new TurtleRenderContext(this);
    this.key = configures.key ?? generateKey();
    this.cleanUpFn = [];
    this.reactive = true
    this.html = (raws, ...values) => {
      return render({ raws, values }, this.renderContext);
    };

    this.template = configures.template?.bind(this) ?? function() {
      return this.html``;
    };

    this.onStateChange = (state, action, key, oldValue, newValue) => {
      if (action === "updated") {
        this.observers[state]?.bind(this)(newValue, oldValue);
        this.requestUpdate(state,newValue);
      }
    };

    this.prepare();
  }

  get refs(){
    return this.renderContext.refs
  }
  
  clear(){
    this.root.textContent = ""
  }
  
  prepare() {
    this.statesManager = new TurtleStateManager(
      this.configures.states ?? {},
      this.onStateChange
    );
    this.states = this.statesManager.proxyState;
  }

  requestRender() {
    this.element.textContent = "";
    this.element.appendChild(this?.template());
    this.onRender();
  }

  requestUpdate(state,newValue) {
    if(!this.reactive) return
    let bindings= this.renderContext.getBinding(state)
    if(bindings.length > 0) TurtleComponentReactive.react(state,this,bindings,newValue)
  }

  requestCleanUp() {
    this.cleanUpFn.forEach((fn) => fn())
  }
}

export function createComponent(configures) {
  const Caller = function(...props){
      return new TurtleComponent(configures, props);
  }

  Caller.component = TurtleComponent;
  return Caller;
}