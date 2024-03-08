export function parserContent(content) {
  content = new DOMParser().parseFromString(
    `<root>${content}</root>`,
    "text/xml"
  ).querySelector("root")
  return content
}