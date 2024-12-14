import { TurtleRenderContext } from '../render/context.js';
import { TurtleContextManager } from '../context/manager.js';
import { render } from '../render/index.js';
import {registerComponent} from '../dev/index.js';

export class TurtleComponent {
  static ins = TurtleComponent;

  constructor(...props) {
    this.props = props;
    this.contexts = {}
    this._cleanUpFn = [];
    this._element = null;
    this._parent = null;
    this._forwardRefs = {};
    this._renderContext = new TurtleRenderContext(this);
  }


  onInit() {}
  onCreate() {}
  onRender() {}
  onUpdate() {}
  onDestroy() {}

  getContext(name, traceback = true) {
    return this.contexts.get(name,traceback)
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
    this._forwardRefs = refs || {};
    registerComponent(this)
  }

  html(raws, ...values) {
    return render(this._renderContext, { raws, values });
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