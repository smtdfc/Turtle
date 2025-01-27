export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj; 
  }

  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i]); 
    }
    return arrCopy;
  }

  const objCopy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key]); 
    }
  }
  return objCopy;
}

