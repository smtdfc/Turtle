import { TurtleRenderContext } from '../render/context.js';
import { TurtleContextManager } from '../context/manager.js';
import { TurtleState } from '../state/index.js';
import { render } from '../render/index.js';
import { registerComponent } from '../dev/index.js';

export class TurtleComponent {
  static ins = TurtleComponent;

  constructor(...props) {
    this.props = props;
    this.contexts = {}
    this._app = null
    this._cleanUpFn = [];
    this._element = null;
    this._parent = null;
    this._forwardRefs = {};
    this._ids={};
    this._renderContext = new TurtleRenderContext(this);
  }


  onInit() {}
  onCreate() {}
  onRender() {}
  onUpdate() {}
  onDestroy() {}

  id(refName) {
    if(this._ids[refName]) return this._ids[refName]
    this._ids[refName] = `tid_${(Math.floor((Math.random() *9000)) * Date.now()).toString(32)}`
    return this._ids[refName]
  }

  createState(value) {
    return new TurtleState(this, value)
  }

  clear() {
    this._element.textContent = ""
  }

  get refs() {
    return this._renderContext.refs
  }

  getContext(name, traceback = true) {
    return this.contexts.get(name, traceback)
  }

  template() {
    return this.html``;
  }

  forwardRefs() {
    return {};
  }

  prepare() {
    this.contexts = new TurtleContextManager(this, this._parent)
    const refs = this.forwardRefs();
    this._forwardRefs = refs;
    registerComponent(this)
  }

  html(raws, ...values) {
    return render(this._renderContext, { raws, values }, this._app);
  }

  requestRender() {
    if (!this._element) {
      throw new Error("Component's root element is not set. Did you forget to attach it?");
    }
    const fragment = this.template();
    this._element.innerHTML = '';
    this._element.appendChild(fragment);
    this.onRender();
  }

  requestCleanUp() {
    this._cleanUpFn.forEach(fn => fn());
  }
}

export function createComponent(_constructor) {
  if (!(_constructor.prototype instanceof TurtleComponent)) {
    throw new Error("Constructor must inherit from TurtleComponent");
  }

  function fn(...props) {
    return new _constructor(...props);
  };

  fn.ins = _constructor
  return fn
}