function isNamespaceAvailable(namespace) {
  return namespace.split('.').reduce((acc, part) => {
    if (acc && acc[part]) {
      return acc[part];
    }
    return null;
  }, window) !== null;
}

export function loadScript(path, options = {}) {
  const { defer = false, async_ = false, module = false } = options;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = path;
    script.defer = defer;
    script.async = async_;
    script.type = 'text/javascript';
    if (module) script.type = "module";

    script.onload = () => resolve();
    script.onerror = (err) => reject(err);

    document.body.appendChild(script);
  });
}



export function loadScriptIfNeeded(path, namespace, options = {}) {
  if (isNamespaceAvailable(namespace)) {
    return Promise.resolve();
  }

  return loadScript(path, options);
}

