export function extractParameters(url, pattern) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const queryString = urlObj.search;

  let regexPattern = pattern
    .replace(/\/:[a-zA-Z0-9_]+/g, "/([^/]+)")
    .replace(/\*/g, ".*")
    .replace(/\?/g, "([^/]+)?")
    .replace(/\/+/g, "/");

  if (regexPattern.includes(".*")) {
    regexPattern = `^${regexPattern}$`;
  } else {
    regexPattern = `^${regexPattern}/?$`;
  }

  const regex = new RegExp(regexPattern);
  const match = pathname.match(regex);

  const params = {};

  if (match) {
    let paramIndex = 1;

    pattern.replace(/\/:([a-zA-Z0-9_]+)/g, (fullMatch, paramName) => {
      params[paramName] = match[paramIndex++];
    });

    if (queryString) {
      const queryParams = {};
      const queryParts = queryString.substring(1).split('&');
      queryParts.forEach(part => {
        const [key, value] = part.split('=');
        queryParams[key] = value;
      });
      params.query = queryParams;
    }

    return params;
  }

  return null;
}