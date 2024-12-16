import {TurtleComponent} from './component.js';

function generateCompoenentElementClass(component,parent) {
  return class extends HTMLElement {
    #_component;
    #_parent;
    constructor() {
      super();
      this.#_component = component;
      this.#_parent = parent
    }

    get forwardRefs() {
      return this.#_component?.forwardRefs;
    }

    connectedCallback() {
      this.#_component._parent = this.#_parent
      this.#_component._element= this
      this.#_component?.onInit?.();
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

export function createComponentElementTag(component,parent) {
  let tagName = `c${(Math.floor((Math.random() *1000)) * Date.now()).toString(16)}-${component.constructor.name.toLowerCase()}`;

  function cleanUp() {
    if (customElements.get(`turtle-component-${tagName}`)) {
      
      //window.customElements.define(`turtle-component-${tagName}`, HTMLUnknownElement);
    }
  }

  if (!component._cleanUpFn) {
    component._cleanUpFn = [];
  }

  component._cleanUpFn.push(cleanUp);
  if (!customElements.get(`turtle-component-${tagName}`)) {
    window.customElements.define(`turtle-component-${tagName}`, generateCompoenentElementClass(component,parent));
  }

  return `turtle-component-${tagName}`
}

export function getComponentInstance(instance) {
  if (instance instanceof TurtleComponent) {
    return instance
  }

  if(instance.ins.prototype instanceof TurtleComponent){
    return instance()
  }
  
  return null
}