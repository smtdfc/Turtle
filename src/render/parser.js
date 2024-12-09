/**
 * Parses a string of HTML content and wraps it in a root element.
 * 
 * @param {string} content - The HTML content to parse.
 * @returns {Element|null} - Returns the root element if parsing is successful, or null if there is a parsing error.
 * @throws {Error} Throws an error if there is a parsing issue with detailed information.
 */
export function parseHTML(content) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(`<root>${content}</root>`, "application/xhtml+xml");
  let parserError = doc.getElementsByTagName("parsererror");
  
  if (parserError.length > 0) {
    const errorMessage = "Rendering error: " + parserError[0].textContent;
    console.log(errorMessage);
    throw new Error(errorMessage);
  } else {
    return doc.getElementsByTagName("root")[0];
  }
}