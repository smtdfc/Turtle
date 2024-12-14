export function parseContent(content) {
  let parser = new DOMParser()
  let result = parser.parseFromString(
    `<root xmlns="http://www.w3.org/1999/xhtml" >${content}</root>`,
    "application/xhtml+xml"
  )
  let root = result.childNodes[0]
  if(result.getElementsByTagName("parsererror").length>0){
    let parsererror = result.getElementsByTagName("parsererror")[0]
    throw Error(`[Turtle Parser Error] ${parsererror.textContent}` )
  }
  return result.childNodes[0]
}