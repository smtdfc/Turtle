
export function matches(pattern, urlToMatch) {
  const patternParts = pattern.split('/');
  const urlParts = urlToMatch.split('/');

  if (patternParts.length !== urlParts.length) {
    return { matched: false };
  }

  const params = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const urlPart = urlParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = urlPart;
    } else if (patternPart === '*') {
      continue
    } else if (patternPart !== urlPart) {
      return { matched: false };
    }
  }

  return { matched: true, params };
}

