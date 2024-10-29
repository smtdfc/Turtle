/**
 * Parses a given HTML string and returns the root element of the parsed document.
 *
 * @param {string} content - The HTML content to be parsed.
 * @returns {Element|null} The root element of the parsed document, or null if parsing fails.
 */
export function parseHTML(content) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(`<root>${content}</root>`, "text/xml");
  let parserError = doc.getElementsByTagName("parsererror");

  if (parserError.length > 0) {
    console.log("error")
    // Error handling can be added here if needed
    return null;
  } else {
    return doc.getElementsByTagName("root")[0];
  }
}