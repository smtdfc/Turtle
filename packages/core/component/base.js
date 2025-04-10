import { generateKey } from '../utils/generate.js';
import { deepClone } from '../utils/clone.js';
import { render } from '../render/index.js';
import { TurtleRenderContext } from '../render/context.js';
import { TurtleStateManager } from './state.js';
import { TurtleComponentReactive } from "./reactive.js"

export class TurtleComponent {
  constructor(configures, props) {
    this.props = props
    this.configures = { ...configures }
    this.onRender = new Function();
    this.onInit = new Function();
    this.onCreate = new Function();
    this.onDestroy = new Function();
    this.observers = {};
    this.forwardRefs = {};
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
      if (action === "updated" || action === "created") {
        this.observers[state]?.bind(this)(newValue, oldValue);
        this.requestUpdate(state, newValue);
      }
    };

    Object.entries(configures).forEach(([key, value]) => {
      this[key] = typeof value === "function" ? value.bind(this) : value;
    });

    Object.entries(this.forwardRefs).forEach(([key, value]) => {
      this.forwardRefs[key] = typeof value === "function" ? value.bind(this) : value;
    });
    this.prepare();
    this._alias = {}
  }

  forwardRef(name) {
    let ref = Object.create({})
    this.refs[name] = ref
    return this.renderContext.refs[name]
  }

  id(alias) {
    if (!this._alias[alias]) this._alias[alias] = `_${generateKey()}`
    return this._alias[alias]
  }

  get refs() {
    return this.renderContext.refs
  }

  destroy() {
    this.element.remove()
  }

  clear() {
    this.element.textContent = ""
  }

  prepare() {
    this.statesManager = new TurtleStateManager(
      Object.assign({}, this.configures.states) ?? {},
      this.onStateChange
    );
    this.states = this.statesManager.proxyState;
  }

  requestRender() {
    this.element.textContent = "";
    this.element.appendChild(this?.template());
    this.onRender();
  }

  requestUpdate(state, newValue) {
    if (!this.reactive) return
    let bindings = this.renderContext.getBinding(state) ?? []
    if (bindings.length > 0) TurtleComponentReactive.react(state, this, bindings, newValue)
  }

  requestCleanUp() {
    this.states = null;
    this.cleanUpFn.forEach(fn => fn());
    this.cleanUpFn = [];
    if (this.element?.remove) {
      this.element.remove();
    }
    this.element = null;
    Object.keys(this).forEach(key => {
      this[key] = null;
    });
  }
}

export function createComponent(configures) {
  const Caller = function(...props) {
    return new TurtleComponent(Object.assign({}, configures), props);
  }

  Caller.component = TurtleComponent;
  return Caller;
}