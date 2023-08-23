export function update(mem,context) {
  for (let i = 0; i < mem.length; i++) {
    let info = mem[i]
    let template = info.temp
    let node = info.node
    let value = template.replace(/{{(.*?)}}/g, (match) => {
      let expr = match.split(/{{|}}/)[1]
      try {
        let value = (new Function(`return ${expr}`).apply(context))
        return value
      } catch (err) {
        if (window.TURTLE.TURTLE_DEV) {
          document.body.innerHTML = `
      				<h5 style="color:red">Error when render content of  component  : "..  {{${expr}}}.."</h5>
      				<pre style="color:red ; overflow-x:scroll; max-width:98%;">${err.stack}</pre>
      			`
          throw "err"
        }
        return "?"
      }
    })

    if (info.atrr) {
      node.setAttribute(info.atrr, value)
    } else {
      node.textContent = value
    }
  }
}