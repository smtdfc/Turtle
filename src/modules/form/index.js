export class TurtleFormModuleValidatorRules {
  /**
   * Creates an instance of TurtleFormModuleValidatorRules.
   */
  constructor() {
    this.validations = [];
    this.errors = [];
    this.fieldAlias = null;
  }

  /**
   * Sets an alias for the field being validated.
   * @param {string} name - The alias name for the field.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  alias(name) {
    this.validations.push({
      rule: (value) => true,
    });
    this.fieldAlias = name;
    return this;
  }

  /**
   * Validates that the value is not null or empty.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNotNull() {
    this.validations.push({
      rule: (value) => value !== null && value !== undefined && value.trim() !== "",
      errorMessage: "Value cannot be null or empty."
    });
    return this;
  }

  /**
   * Validates that the value does not exceed the specified maximum length.
   * @param {number} max - The maximum allowed length of the value.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  maxLength(max) {
    this.validations.push({
      rule: (value) => value.length <= max,
      errorMessage: `Value must be at most ${max} characters long.`
    });
    return this;
  }

  /**
   * Validates that the value meets the specified minimum length.
   * @param {number} min - The minimum required length of the value.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  minLength(min) {
    this.validations.push({
      rule: (value) => value.length >= min,
      errorMessage: `Value must be at least ${min} characters long.`
    });
    return this;
  }

  /**
   * Validates that the value contains at least one number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsNumber() {
    this.validations.push({
      rule: (value) => /\d/.test(value),
      errorMessage: "Value must contain at least one number."
    });
    return this;
  }

  /**
   * Validates that the value contains at least one uppercase letter.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsUppercase() {
    this.validations.push({
      rule: (value) => /[A-Z]/.test(value),
      errorMessage: "Value must contain at least one uppercase letter."
    });
    return this;
  }

  /**
   * Validates that the value contains at least one lowercase letter.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsLowercase() {
    this.validations.push({
      rule: (value) => /[a-z]/.test(value),
      errorMessage: "Value must contain at least one lowercase letter."
    });
    return this;
  }

  /**
   * Validates that the value contains at least one special character.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  containsSpecialChar() {
    this.validations.push({
      rule: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      errorMessage: "Value must contain at least one special character."
    });
    return this;
  }

  /**
   * Validates that the value is a valid email address.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isEmail() {
    this.validations.push({
      rule: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMessage: "Value must be a valid email address."
    });
    return this;
  }

  /**
   * Validates that the value is a valid phone number in international format.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isPhoneNumber() {
    this.validations.push({
      rule: (value) => /^\+?[1-9]\d{1,14}$/.test(value),
      errorMessage: "Value must be a valid phone number in international format."
    });
    return this;
  }

  /**
   * Validates that the value is a valid date.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isDate() {
    this.validations.push({
      rule: (value) => !isNaN(Date.parse(value)),
      errorMessage: "Value must be a valid date."
    });
    return this;
  }

  /**
   * Validates that the date is before a specified date.
   * @param {string} date - The date to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isBefore(date) {
    this.validations.push({
      rule: (value) => new Date(value) < new Date(date),
      errorMessage: `Date must be before ${date}.`
    });
    return this;
  }

  /**
   * Validates that the date is after a specified date.
   * @param {string} date - The date to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isAfter(date) {
    this.validations.push({
      rule: (value) => new Date(value) > new Date(date),
      errorMessage: `Date must be after ${date}.`
    });
    return this;
  }

  /**
   * Validates that the value is within a specified range.
   * @param {number} min - The minimum allowed value.
   * @param {number} max - The maximum allowed value.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isInRange(min, max) {
    this.validations.push({
      rule: (value) => value >= min && value <= max,
      errorMessage: `Value must be between ${min} and ${max}.`
    });
    return this;
  }

  /**
   * Validates that the value matches a specified regular expression.
   * @param {RegExp} regex - The regular expression to test against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  matchesRegex(regex) {
    this.validations.push({
      rule: (value) => regex.test(value),
      errorMessage: `Value must match the required pattern.`
    });
    return this;
  }

  /**
   * Validates that the value contains only alphabetic characters.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isAlpha() {
    this.validations.push({
      rule: (value) => /^[a-zA-Z]+$/.test(value),
      errorMessage: "Value must contain only alphabetic characters."
    });
    return this;
  }

  /**
   * Validates that the value contains only alphanumeric characters.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isAlphaNumeric() {
    this.validations.push({
      rule: (value) => /^[a-zA-Z0-9]+$/.test(value),
      errorMessage: "Value must contain only alphanumeric characters."
    });
    return this;
  }

  /**
   * Validates that the value contains only numeric characters.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNumeric() {
    this.validations.push({
      rule: (value) => /^[0-9]+$/.test(value),
      errorMessage: "Value must contain only numeric characters."
    });
    return this;
  }

  /**
   * Validates that the value is a valid URL.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isUrl() {
    this.validations.push({
      rule: (value) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value),
      errorMessage: "Value must be a valid URL."
    });
    return this;
  }

  /**
   * Validates that the value is equal to a specified value.
   * @param {*} compareValue - The value to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isEqualTo(compareValue) {
    this.validations.push({
      rule: (value) => value === compareValue,
      errorMessage: `Value must be equal to ${compareValue}.`
    });
    return this;
  }

  /**
   * Validates that the value is not equal to a specified value.
   * @param {*} compareValue - The value to compare against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNotEqualTo(compareValue) {
    this.validations.push({
      rule: (value) => value !== compareValue,
      errorMessage: `Value must not be equal to ${compareValue}.`
    });
    return this;
  }

  /**
   * Validates that the value starts with a specified prefix.
   * @param {string} prefix - The prefix to check against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  startsWith(prefix) {
    this.validations.push({
      rule: (value) => value.startsWith(prefix),
      errorMessage: `Value must start with '${prefix}'.`
    });
    return this;
  }

  /**
   * Validates that the value ends with a specified suffix.
   * @param {string} suffix - The suffix to check against.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  endsWith(suffix) {
    this.validations.push({
      rule: (value) => value.endsWith(suffix),
      errorMessage: `Value must end with '${suffix}'.`
    });
    return this;
  }

  /**
   * Validates that the value is a positive number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isPositiveNumber() {
    this.validations.push({
      rule: (value) => !isNaN(value) && Number(value) > 0,
      errorMessage: "Value must be a positive number."
    });
    return this;
  }

  /**
   * Validates that the value is a negative number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isNegativeNumber() {
    this.validations.push({
      rule: (value) => !isNaN(value) && Number(value) < 0,
      errorMessage: "Value must be a negative number."
    });
    return this;
  }

  /**
   * Validates that the value is an integer.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isInteger() {
    this.validations.push({
      rule: (value) => Number.isInteger(Number(value)),
      errorMessage: "Value must be an integer."
    });
    return this;
  }

  /**
   * Validates that the value is a floating-point number.
   * @returns {TurtleFormModuleValidatorRules} The current instance for chaining.
   */
  isFloat() {
    this.validations.push({
      rule: (value) => !isNaN(value) && value.toString().includes('.'),
      errorMessage: "Value must be a floating-point number."
    });
    return this;
  }

  validate(value) {
    this.errors = [];
    for (const validation of this.validations) {
      if (!validation.rule(value)) {
        this.errors.push(validation.errorMessage);
      }
    }
    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }

}

/**
 * Class representing a form validator module.
 */
class TurtleFormModuleValidator {
  /**
   * Creates an instance of the form validator.
   * @param {Object} module - The module associated with the validator.
   * @param {HTMLElement} element - The form element to validate.
   */
  constructor(module, element) {
    this._module = module;
    this.element = element;
    this.events = {};
    this.rules = {};
  }

  /**
   * Registers an event listener for a specified event name.
   * @param {string} name - The name of the event.
   * @param {Function} callback - The callback function to execute when the event occurs.
   */
  on(name, callback) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(callback);
  }

  /**
   * Unregisters an event listener for a specified event name.
   * @param {string} name - The name of the event.
   * @param {Function} callback - The callback function to remove.
   */
  off(name, callback) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter(cb => cb !== callback);
    }
  }

  /**
   * Validates the form elements based on defined rules and triggers the appropriate events.
   */
  validate() {
    const values = {};
    const errors = [];
    for (const selector in this.rules) {
      const value = this.element.querySelector(selector).value;
      const validator = this.rules[selector];
      if (!validator.validate(value)) {
        errors.push({ field: selector, messages: validator.getErrors() });
      } else {
        values[validator.fieldAlias ?? selector] = value;
      }
    }

    if (errors.length > 0) {
      this.triggerEvent('error', errors);
    } else {
      this.triggerEvent('success', values);
    }
  }

  /**
   * Triggers an event with the specified name and data.
   * @param {string} name - The name of the event to trigger.
   * @param {*} data - The data to pass to the event callbacks.
   */
  triggerEvent(name, data) {
    if (this.events[name]) {
      this.events[name].forEach(callback => callback(data));
    }
  }

  /**
   * Validates the form when it is submitted, preventing default form submission if specified.
   * @param {boolean} [prevent=true] - Whether to prevent the default form submission.
   */
  validateWhenSubmit(prevent = true) {
    this.element.addEventListener("submit", function(event) {
      if (prevent) event.preventDefault();
      this.validate();
    }.bind(this));
  }
}

/**
 * Class representing the form module in the application.
 */
export class TurtleFormModule {
  /**
   * Creates an instance of the form module.
   * @param {Object} app - The application instance.
   * @param {Object} configs - Configuration options for the form module.
   */
  constructor(app, configs) {
    this._app = app;
    this._app.modules.push(this);
    this._app.form = this;
    this.configs = configs;
  }

  /**
   * Initializes the form module.
   * @param {Object} app - The application instance.
   * @param {Object} configs - Configuration options for the form module.
   * @returns {TurtleFormModule} The initialized form module.
   */
  static init(app, configs) {
    return new TurtleFormModule(app, configs);
  }

  /**
   * Creates a form validator for a specified form element.
   * @param {HTMLElement} element - The form element to validate.
   * @returns {TurtleFormModuleValidator} The form validator instance.
   */
  createFormValidator(element) {
    return new TurtleFormModuleValidator(this, element);
  }
}