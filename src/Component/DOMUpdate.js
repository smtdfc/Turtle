export function updateDOM(refs, context) {
	refs.refTextNodes.forEach(function(ref) {
		updateTextNode(ref.node, ref.content, context)
	})
	
	refs.refAttrs.forEach(function(ref) {
		updateAttr(ref.node,ref.name,ref.value,context)
	})
	
}

function updateTextNode(node, template, data) {
	node.textContent = template.replace(/{{(.*?)}}/g, (match) => {
		let expr = match.split(/{{|}}/)[1]
		try {
			let value = (new Function(`return ${expr}`).apply(data))
			return value
		} catch (err) {
			if (window.TURTLE_DEV) {
				document.body.innerHTML = `
				<h5 style="color:red">Error when render content of  component  : "..  {{${expr}}}.."</h5>
				<pre style="color:red ; overflow-x:scroll; max-width:98%;">${err.stack}</pre>
			`
				throw "err"
			}
			return "?"
		}
	})

}

function updateAttr(node, attrName, template, data) {
	node.setAttribute(attrName, template.replace(/{{(.*?)}}/g, (match) => {
		let expr = match.split(/{{|}}/)[1]
		try {
			return (new Function(`return ${expr}`)).apply(data)
		} catch (err) {
			if (window.TURTLE_DEV) {
				document.body.innerHTML = `
				<h5 style="color:red">Error in expression  : "..  {{${expr}}}.."</h5>
				<pre style="color:red; overflow-x:scroll ; max-width:98%;">${err.stack}</pre>
			`
				throw "err"
			}
			return "?"
		}
	}))
}