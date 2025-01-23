
export class TurtleContext {
  constructor(globalName = "", initValues = {}) {
    this.globalName = globalName
    this.events = {}
    this.values = initValues
    if (!window.__TURTLE__._contexts[globalName]) window.__TURTLE__._contexts[globalName] = this
  }

  on(name, callback ){
    if(!this.events[name]) this.events[name]=[]
    this.events[name].push(callback)
  }
  
  emitEvent(name,data){
    if(!this.events[name]) this.events[name]=[]
    this.events[name].forEach(fn=>fn(data))
  }
  
  onValueChange(state, action, key, oldValue, newValue){}

  _isObject(value) {
    return value && typeof value === "object";
  }

  _createProxy(target, parentKey, rootKey) {
    return new Proxy(target, {
      set: (targetObj, key, newValue, receiver) => {
        const isNewProperty = !(key in targetObj);
        const oldValue = targetObj[key];
        const fullKeyPath = parentKey ? `${parentKey}.${key}` : key;

        if (this._isObject(newValue)) {
          newValue = this._createProxy(newValue, fullKeyPath, rootKey || fullKeyPath);
        }

        Reflect.set(targetObj, key, newValue, receiver);
        if (oldValue !== newValue || isNewProperty) {
          this.onChangeCallback(this.getStateNameFromPath(fullKeyPath), isNewProperty ? "created" : "updated", fullKeyPath, oldValue, newValue);
        }
        return true
      },
      get: (targetObj, key, receiver) => {
        const value = Reflect.get(targetObj, key, receiver);
        if (this._isObject(value)) {
          const fullKeyPath = parentKey ? `${parentKey}.${key}` : key;
          return this._createProxy(value, fullKeyPath, rootKey || fullKeyPath);
        }
        return value;
      },
      deleteProperty: (targetObj, key) => {
        const oldValue = targetObj[key];
        const fullKeyPath = parentKey ? `${parentKey}.${key}` : key;
        this.onChangeCallback(this.values, "deleted", fullKeyPath, oldValue, undefined);
        return Reflect.deleteProperty(targetObj, key);
      },
    });
  }

  isValidPathFormat(path) {
    let currentSegment = '';
    let braceDepth = 0;
    let baseSetFlag = false;

    for (let char of path) {
      if (char === '.') {
        if (!currentSegment || baseSetFlag) return false;
        currentSegment = '';
        baseSetFlag = true;
      } else if (char === '[') {
        if (!currentSegment || baseSetFlag) return false;
        currentSegment = '';
        braceDepth++;
      } else if (char === ']') {
        if (!currentSegment || baseSetFlag || braceDepth === 0) return false;
        braceDepth--;
      } else if (char === ' ') {
        continue;
      } else if (/^[a-zA-Z0-9]$/.test(char)) {
        baseSetFlag = false;
        currentSegment += char;
      } else {
        return false;
      }
    }

    return braceDepth === 0 && currentSegment.length > 0 && !baseSetFlag;
  }

  set(path, value) {
    if (!this.isValidPathFormat(path)) {
      throw new Error(`Invalid path format: "${path}". Ensure the path follows the correct format.`);
    }

    try {
      let setterFunction = new Function("value", `this.values.${path} = value;`);
      setterFunction.call(this, value);
    } catch (err) {

      console.error(`Failed to set value at path: "${path}"`, err);
      throw new Error(`[Context Manager Error] Error occurred while updating the state at path: "${path}".`);
    }
  }

  get(path) {
    if (!this.isValidPathFormat(path)) {
      throw new Error(`Invalid path format: "${path}". Ensure the path follows the correct format.`);
    }

    try {
      let getterFunction = new Function("value", `return this.values.${path}`);
      return getterFunction.call(this)
    } catch (err) {
      console.error(`Failed to set value at path: "${path}"`, err);
      throw new Error(`[Context Manager Error] Error occurred while getting the state at path: "${path}".`);
    }
  }

  has(name) {
    return Reflect.has(this.values, name)
  }

  getValues() {
    return this.values;
  }

}

export function createContext(globalName,initValues){
  if(!window.__TURTLE__._contexts) window.__TURTLE__._contexts[globalName] = new TurtleContext(globalName,initValues)
  return window.__TURTLE__._contexts[globalName]
}