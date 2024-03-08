export {render as fragment} from './dom/render.js';
export * from "./component/index.js"
export * from "./component/state.js"
export * from "./app/index.js"
export * from "./modules/router/index.js"
export function addScript(src, asyncLoad = false, script) {
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
    d.getElementsByTagName('body')[0].appendChild(script)
  })

}