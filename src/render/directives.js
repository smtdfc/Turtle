/**
 * Represents a directive for attaching event listeners to a target element.
 */
export class EventDirective {
  /**
   * Creates an instance of EventDirective.
   * 
   * @param {HTMLElement} target - The target element to which the event listener will be attached.
   * @param {string} name - The name of the event to listen for (e.g., 'click', 'mouseover').
   * @param {string} value - The name of the method to be called when the event is triggered.
   * @param {Object} context - The context in which the event handler method is defined.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Attaches the event listener to the target element, using the specified method from the context.
   */
  apply() {
    if (this.context.root[this.value]) {
      this.target.addEventListener(this.name, this.context.root[this.value].bind(this.context.root));
    }
  }
}

/**
 * Represents a directive for binding attributes to a target element.
 */
export class BindingDirective {
  /**
   * Creates an instance of BindingDirective.
   * 
   * @param {HTMLElement} target - The target element to bind the attribute to.
   * @param {string} name - The name of the attribute to bind (e.g., 'class', 'style').
   * @param {string} value - The state name to bind to the attribute.
   * @param {Object} context - The context managing the binding logic.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the binding directive by binding the specified attribute to the target element.
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
 * Represents a directive for binding innerHTML to a target element.
 */
export class HTMLDirective {
  /**
   * Creates an instance of HTMLDirective.
   * 
   * @param {HTMLElement} target - The target element to bind innerHTML to.
   * @param {string} name - The name of the property (always 'innerHTML').
   * @param {string} value - The state name to bind to innerHTML.
   * @param {Object} context - The context managing the binding logic.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the HTML directive by binding innerHTML to the target element.
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
 * Represents a directive for binding textContent to a target element.
 */
export class TextContentDirective {
  /**
   * Creates an instance of TextContentDirective.
   * 
   * @param {HTMLElement} target - The target element to bind textContent to.
   * @param {string} name - The name of the property (always 'textContent').
   * @param {string} value - The state name to bind to textContent.
   * @param {Object} context - The context managing the binding logic.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the text content directive by binding textContent to the target element.
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
 * Represents a directive for adding a reference to a DOM element.
 */
export class RefDirective {
  /**
   * Creates an instance of RefDirective.
   * 
   * @param {HTMLElement} target - The target element to be referenced.
   * @param {string} name - The name of the reference.
   * @param {string} value - The unique identifier for the reference.
   * @param {Object} context - The context managing the references.
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

/**
 * Represents a directive for adding a model binding to a DOM element.
 */
export class ModelDirective {
  /**
   * Creates an instance of ModelDirective.
   * 
   * @param {HTMLElement} target - The target element to bind the model to.
   * @param {string} name - The name of the model binding.
   * @param {string} value - The unique identifier for the model binding.
   * @param {Object} context - The context managing the model bindings.
   */
  constructor(target, name, value, context) {
    this.target = target;
    this.name = name;
    this.value = value;
    this.context = context;
  }

  /**
   * Applies the model directive by adding a model binding to the target element.
   */
  apply() {
    this.context.addModel(this.value, this.target);
  }
}