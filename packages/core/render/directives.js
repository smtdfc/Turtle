function parseKeyValuePairs(input) {
  const result = {};
  const pairs = input.split(',');
  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    result[key.trim()] = value.trim();
  });
  return result;
}

function parseEventName(eventName) {
  const modifiers = [];
  let name = eventName;

  while (name.includes('.')) {
    const modifierIndex = name.lastIndexOf('.');
    const modifier = name.slice(modifierIndex + 1);
    modifiers.unshift(modifier);
    name = name.slice(0, modifierIndex);
  }

  return {
    eventName: name,
    modifiers: modifiers
  };
}

export const TurtleReferenceDirective = {
  init: function(context, expr, target) {
    context.addRef(expr, target);
  }
};

export const TurtleHTMLBindingDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) context.target.statesManager.set(stateName, "");
    let currentValue = context.target.statesManager.get(expr);
    target.innerHTML = currentValue;

    context.addBinding(stateName, {
      state: stateName,
      expr: expr,
      target: target,
      bind: {
        type: "property",
        name: "innerHTML"
      }
    });
  }
};

export const TurtleDisableStateBindingDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) context.target.statesManager.set(stateName, false);
    let currentValue = context.target.statesManager.get(expr);
    target.disabled = currentValue;

    context.addBinding(stateName, {
      state: stateName,
      expr: expr,
      target: target,
      bind: {
        type: "property",
        name: "disabled"
      }
    });
  }
};


export const TurtleTextBindingDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) context.target.statesManager.set(stateName, "");
    let currentValue = context.target.statesManager.get(expr);
    target.textContent = currentValue;

    context.addBinding(stateName, {
      state: stateName,
      expr: expr,
      target: target,
      bind: {
        type: "property",
        name: "textContent"
      }
    });
  }
};

export const TurtleShowBindingDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) {
      context.target.statesManager.set(stateName, true);
    }
    let currentValue = context.target.statesManager.get(expr);

    target.style.display = currentValue ? "block" : "none";
    context.addBinding(stateName, {
      state: stateName,
      expr: expr,
      target: target,
      bind: {
        type: "function",
        fn: function(element, value) {
          element.style.display = value ? "block" : "none";
        }
      }
    });
  }
};

export const TurtleClassBindingDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) context.target.statesManager.set(stateName, "");
    let currentValue = context.target.statesManager.get(expr);
    target.className = currentValue;

    context.addBinding(stateName, {
      state: stateName,
      expr: expr,
      target: target,
      bind: {
        type: "property",
        name: "className"
      }
    });
  }
};

export const TurtleStyleBindingDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) context.target.statesManager.set(stateName, "");
    let currentValue = context.target.statesManager.get(expr);
    target.style = currentValue;

    context.addBinding(stateName, {
      state: stateName,
      expr: expr,
      target: target,
      bind: {
        type: "property",
        name: "style"
      }
    });
  }
};

export const TurtleModelDirective = {
  init: function(context, expr, target) {
    let stateName = context.target.statesManager.getStateNameFromPath(expr);
    if (!context.target.statesManager.has(stateName)) {
      context.target.statesManager.set(stateName, "");
    }
    let currentValue = context.target.statesManager.get(expr);

    if (target.tagName === "input") {
      if (target.type === "checkbox" || target.type === "radio") {
        target.checked = currentValue;
      } else if (target.type === "file") {} else {
        target.value = currentValue;
      }
    } else if (target.tagName === "textarea") {
      target.value = currentValue;
    } else if (target.tagName === "select") {
      target.value = currentValue;
    } else {
      target.textContent = currentValue;
    }

    target.addEventListener("input", function() {
      let newValue;

      if (target.tagName === "INPUT") {
        if (target.type === "checkbox" || target.type === "radio") {
          newValue = target.checked;
        } else if (target.type === "file") {
          newValue = target.files;
        } else {
          newValue = target.value;
        }
      } else if (target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        newValue = target.value;
      } else {
        newValue = target.textContent;
      }

      context.target.statesManager.set(expr, newValue);
    });
  }
};

export const TurtleAttrsBindingDirective = {
  init: function(context, value, target) {
    let pairs = parseKeyValuePairs(value)
    for (let attrName of Object.keys(pairs)) {
      let expr = pairs[attrName]
      let stateName = context.target.statesManager.getStateNameFromPath(expr);
      if (!context.target.statesManager.has(stateName)) context.target.statesManager.set(stateName, "");
      let currentValue = context.target.statesManager.get(expr);
      target.setAttribute(attrName, currentValue)

      context.addBinding(stateName, {
        state: stateName,
        expr: expr,
        target: target,
        bind: {
          type: "attr",
          name: attrName
        }
      });
    }
  }
}

export const TurtleEventsDirective = {
  init: function(context, value, target) {
    let pairs = parseKeyValuePairs(value)
    for (let eventName of Object.keys(pairs)) {
      let callbackFunctionName = pairs[eventName]
      let eventInfo = parseEventName(eventName)
      let callback = context.target.configures[callbackFunctionName]

      const eventListener = function(event) {
        if (eventInfo.modifiers.includes("prevent")) event.preventDefault();
        if (eventInfo.modifiers.includes("stop")) event.stopPropagation();

        if (eventInfo.modifiers.includes("once")) {
          target.removeEventListener(eventInfo.eventName, eventListener);
        }
        callback.call(context.target, event);
      };
      target.addEventListener(eventInfo.eventName, eventListener);
    }
  }
}


export const TurtleRenderDirectives = {
  "t-ref": TurtleReferenceDirective,
  "t-html": TurtleHTMLBindingDirective,
  "t-text": TurtleTextBindingDirective,
  "t-show": TurtleShowBindingDirective,
  "t-disabled": TurtleDisableStateBindingDirective,
  "t-style": TurtleStyleBindingDirective,
  "t-class": TurtleClassBindingDirective,
  "t-model": TurtleModelDirective,
  "t-binds": TurtleAttrsBindingDirective,
  "t-events": TurtleEventsDirective
};