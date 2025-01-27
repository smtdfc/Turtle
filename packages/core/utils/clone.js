export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  const stack = [{ src: obj, target: Array.isArray(obj) ? [] : {} }];
  const seen = new WeakMap();

  while (stack.length) {
    const { src, target } = stack.pop();
    seen.set(src, target);

    for (const key in src) {
      if (Object.hasOwnProperty.call(src, key)) {
        const value = src[key];
        if (value && typeof value === "object") {
          if (seen.has(value)) {
            target[key] = seen.get(value); // Handle circular references
          } else {
            const newTarget = Array.isArray(value) ? [] : {};
            target[key] = newTarget;
            stack.push({ src: value, target: newTarget });
          }
        } else {
          target[key] = value;
        }
      }
    }
  }

  return stack[0]?.target || {};
}