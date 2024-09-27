import { TurtleComponent } from './component.js';

/**
 * TurtleComponentCaller class is responsible for creating and initializing Turtle components.
 */
export class TurtleComponentCaller {

  /**
   * Creates an instance of TurtleComponentCaller.
   * 
   * @param {Object|null} context - The rendering context or other relevant context (can be null).
   * @param {Function} component - The component class (constructor) to be instantiated.
   * @param {Object} [props={}] - The props to be passed to the component instance.
   */
  constructor(context, component, props = {}) {
    this.context = context;
    this.props = props;
    this.component = component;
  }

  /**
   * Instantiates the component and attaches it to a given DOM element.
   * 
   * @param {HTMLElement} element - The DOM element to which the component will be attached.
   */
  call(base) {
    new this.component(base._app,base, this.props);
  }
}

/**
 * A factory function that creates a callable component wrapper.
 * 
 * @param {Function} _constructor - The constructor function of the component.
 * @returns {Function} A function that can be used to create a TurtleComponentCaller instance.
 */
export function createComponent(_constructor) {

  /**
   * Callable function that creates a TurtleComponentCaller instance.
   * 
   * @param {...any} props - The properties to be passed to the component.
   * @returns {TurtleComponentCaller} A new TurtleComponentCaller instance.
   */
  function fn(...props) {
    return new TurtleComponentCaller(null, _constructor, props);
  }

  /**
   * A static property referencing the TurtleComponent class.
   * Can be used for further configuration or reference.
   * 
   * @type {TurtleComponent}
   */
  fn.ins = TurtleComponent;

  return fn;
}