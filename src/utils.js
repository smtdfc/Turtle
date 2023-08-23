export function generateKey(){
  let key = ((Math.floor(Math.random()*99999))*Date.now()).toString(16)
  return `_${key}`
}

export function measureTime(func) {
  let start = performance.now();
  func();
  let end = performance.now();
  return end-start;
}