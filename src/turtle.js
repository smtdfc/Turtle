import {} from './components/base.js';
export * from "./components/component.js"
export { render } from "./components/render.js"
export * from "./modules/router/index.js"
export * from "./app.js"

export function importScript(d, src, asyncLoad=false,script) {
  return new Promise((resolve, reject) => {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = asyncLoad;
    script.onload = function() {
      resolve()
    };
    script.onerr = function() {
      reject()
    }
    script.src = src;
    d.getElementsByTagName('head')[0].appendChild(script)
  })

}