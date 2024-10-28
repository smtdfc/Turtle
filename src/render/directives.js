/**
 * Represents an event directive for adding event listeners to a target element.
 */
export class EventDirective {
  /**
   * Creates an instance of EventDirective.
   * 
   * @param {HTMLElement} target - The target element to attach the event listener to.
   * @param {string} name - The name of the event to listen for.
   * @param {string} value - The name of the method to call on the event.
   * @param {Object} context - The context in which the event method is defined.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the event directive by adding the event listener to the target element.
   */
  apply() {
    if (this.context.root[this.value]) {
      this.target.addEventListener(this.name, this.context.root[this.value].bind(this.context.root));
    }
  }
}

/**
 * Represents a binding directive for binding attributes to a target element.
 */
export class BindingDirective {
  /**
   * Creates an instance of BindingDirective.
   * 
   * @param {HTMLElement} target - The target element to bind the attribute to.
   * @param {string} name - The name of the attribute to bind.
   * @param {string} value - The state name to bind to the attribute.
   * @param {Object} context - The context for the binding.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the binding directive by adding a binding for the attribute to the target element.
   */
  apply() {
    this.context.addBinding(this.value, {
      type: "attribute",
      name: this.name,
      state: this.value,
      target: this.target
    });
  }
}

/**
 * Represents an HTML directive for binding innerHTML to a target element.
 */
export class HTMLDirective {
  /**
   * Creates an instance of HTMLDirective.
   * 
   * @param {HTMLElement} target - The target element to bind innerHTML to.
   * @param {string} name - The name of the property (always 'innerHTML').
   * @param {string} value - The state name to bind to innerHTML.
   * @param {Object} context - The context for the binding.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the HTML directive by adding a binding for innerHTML to the target element.
   */
  apply() {
    this.context.addBinding(this.value, {
      type: "property",
      name: "innerHTML",
      state: this.value,
      target: this.target
    });
  }
}

/**
 * Represents a text content directive for binding textContent to a target element.
 */
export class TextContentDirective {
  /**
   * Creates an instance of TextContentDirective.
   * 
   * @param {HTMLElement} target - The target element to bind textContent to.
   * @param {string} name - The name of the property (always 'textContent').
   * @param {string} value - The state name to bind to textContent.
   * @param {Object} context - The context for the binding.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the text content directive by adding a binding for textContent to the target element.
   */
  apply() {
    this.context.addBinding(this.value, {
      type: "property",
      name: "textContent",
      state: this.value,
      target: this.target
    });
  }
}

/**
 * Represents a reference directive for adding a reference to a DOM element.
 */
export class RefDirective {
  /**
   * Creates an instance of RefDirective.
   * 
   * @param {HTMLElement} target - The target element to be referenced.
   * @param {string} name - The name of the reference.
   * @param {string} value - The unique name to assign to the reference.
   * @param {Object} context - The context for managing references.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the reference directive by adding a reference to the target element.
   */
  apply() {
    this.context.addRef(this.value, this.target);
  }
}