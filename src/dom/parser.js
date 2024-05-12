export function parseHTML(content){
  let parser = new DOMParser()
  let doc = parser.parseFromString(`<root>${content}</root>`,"text/xml")
  
  return doc.getElementsByTagName("root")[0]
}

