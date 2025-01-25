import { TurtleComponent } from './base.js';

function generateCompoenentElementClass(component, parent, app) {
  return class extends HTMLElement {
    #_component;
    #_parent;
    constructor() {
      super();
      this.#_component = component;
      this.#_parent = parent
      this.#_component.app = app
      this.#_component.parent = this.#_parent
      this.#_component.element = this
      this.comp = this.#_component
    }

    get forwardRefs() {
      return this.#_component?.forwardRefs;
    }

    async connectedCallback() {

      if (this.#_component.isSynchronous) this.#_component?.onInit?.();
      else await this.#_component?.onInit?.();
      this.#_component?.prepare?.();
      this.#_component?.onCreate?.();
      this.#_component?.requestRender?.();
      
    }

    disconnectedCallback() {
      this.#_component?.requestCleanUp?.();
      this.#_component?.onDestroy?.();
    }
  };
}

export function createComponentElementTag(component, parent, app) {
  let tagName = `c${(Math.floor((Math.random() *1000)) * Date.now()).toString(16)}-${component.key}`;

  function cleanUp() {
    if (customElements.get(`turtle-component-${tagName}`)) {

      //window.customElements.define(`turtle-component-${tagName}`, HTMLUnknownElement);
    }
  }

  if (!component.cleanUpFn) {
    component.cleanUpFn = [];
  }

  component.cleanUpFn.push(cleanUp);
  if (!customElements.get(`turtle-component-${tagName}`)) {
    window.customElements.define(`turtle-component-${tagName}`, generateCompoenentElementClass(component, parent, app));
  }

  return `turtle-component-${tagName}`
}

export function getComponentInstance(instance, app) {

  if (instance instanceof TurtleComponent) {
    return instance
  }

  if (instance.component === TurtleComponent) {

    return new instance()
  }

  return null
}