import { TurtleComponent } from './component.js';
import { processing } from './processing.js';


export function render(str, ...values) {
  let data = {
    components: {}
  }

  for (let i = 0; i < values.length; i++) {
    let value = values[i]
    if (value instanceof TurtleComponent) {
      let key = (Math.floor(Math.random() * 9999) * Date.now()).toString(16)
      data.components[key] = function(base) {
        value._base = base
        return value.start()
      }

      values[i] = `TurtleComponent_${key}`
    }

    if (value) {
      if (value.instance === TurtleComponent) {
        let key = (Math.floor(Math.random() * 9999) * Date.now()).toString(16)
        value = value()
        data.components[key] = function(base) {
          value._base = base
          return value.start()
        }
        values[i] = `TurtleComponent_${key}`

      }
    }
  }

  let content = new DOMParser().parseFromString(
    `<root>${String.raw(str,...values)}</root>`,
    "text/xml"
  ).querySelector("root")

  let fragment = document.createDocumentFragment()
  processing(
    fragment,
    content,
    {
      data: data,
      root: this
    }
  )

  return fragment
}