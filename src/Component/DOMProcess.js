function matches(content) {
	return /{{(.*?)}}/g.test(content)
}

export function processDOM(dom,child=false){
	let refTextNodes =[]
	let refElementNodes = []
	let refAttrs = []
	let nodes = Array.from(dom.childNodes)
	for (let i in nodes) {
		let node = nodes[i]
		let parent = node.parentNode
		if(node.nodeType === Node.TEXT_NODE){
			if(matches(node.textContent)){
				refTextNodes.push({
					node:node,
					parent:parent,
					content:node.textContent,
				})
			}
		}
		
		if(node.nodeType == Node.ELEMENT_NODE){
			Array.from(node.attributes).forEach((attr) => {
				if (matches(attr.value)) {
					refAttrs.push({
						node: node,
						name: attr.localName,
						value: attr.value,
						attr:attr,
						parent:parent
					})
				}
				
				if (attr.localName == "ref") {
					refElementNodes[attr.value] = node
				}
			})
			if(node.childNodes.length>0){
				let refs = processDOM(node,true)
				refTextNodes.push(...refs.refTextNodes)
				refAttrs.push(...refs.refAttrs)
				refElementNodes.push(...refs.refElementNodes)
			}
		}
	}
	
	return {
		refTextNodes,
		refAttrs,
		refElementNodes
	}
}