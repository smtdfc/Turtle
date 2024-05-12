import {} from "./component/base.js"
import { render } from './dom/render.js';

window.TURTLE = {
  version: "1.0.1"
}

export * from "./builtin/modules/router/index.js"
export * from "./app.js"
export * from "./component/component.js"

export function fragment(raw, ...values) {
  let ctx = {
    refs: {},
    bindings: [],
    type: "fragment"
  }

  return render(raw, values, ctx)
}

export function addScript(src, asyncLoad = false, module = false, script) {
  let d = document
  return new Promise((resolve, reject) => {
    script = d.createElement('script');
    script.type = 'text/javascript';
    if (module) script.type = 'module';
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