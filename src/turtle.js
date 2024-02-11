import {} from './components/base.js';
export * from "./components/component.js"
export { render } from "./components/render.js"
export * from "./modules/router/index.js"
export * from "./app.js"

export function addScript(src, asyncLoad=false,script) {
  let d = document
  return new Promise((resolve, reject) => {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = asyncLoad;
    script.onload = function() {
      resolve()
    };
    script.onerror = function() {
      reject()
    }
    script.src = src;
    d.getElementsByTagName('head')[0].appendChild(script)
  })

}