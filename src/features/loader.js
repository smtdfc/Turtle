/**
 * Dynamically loads a script into the document.
 *
 * @param {string} src - The source URL of the script to load.
 * @param {boolean} [asyncLoad=false] - Whether to load the script asynchronously.
 * @param {boolean} [module=false] - Whether the script should be loaded as a JavaScript module.
 * @param {HTMLScriptElement} [script] - The script element that will be created (optional).
 * @returns {Promise<void>} - A promise that resolves when the script is loaded, or rejects on error.
 */
export function addScript(src, asyncLoad = false, module = false, script) {
  let d = document;
  return new Promise((resolve, reject) => {
    script = d.createElement('script');
    script.type = 'text/javascript';
    if (module) script.type = 'module';
    script.async = asyncLoad;
    script.onload = function() {
      resolve();
    };
    script.onerror = function() {
      reject(new Error(`Failed to load script: ${src}`));
    };
    script.src = src;
    d.getElementsByTagName('body')[0].appendChild(script);
  });
}

/**
 * Ensures that a namespace is available in the given context by dynamically loading a script if needed.
 *
 * @param {string} name - The name of the namespace to check.
 * @param {Object} context - The context in which to check for the namespace (usually the global object).
 * @param {string} path - The path to the script that defines the namespace.
 * @param {boolean} defer - Whether to defer loading of the script.
 * @param {boolean} [module=false] - Whether the script should be loaded as a JavaScript module.
 * @param {boolean} [raise=false] - Whether to throw an error if the script fails to load.
 * @returns {Promise<void>} - A promise that resolves when the namespace is available.
 */
export async function ensureNamespace(name, context, path, defer, module = false, raise = false) {
  if (!(name in context)) {
    try {
      await addScript(path, defer, module);
    } catch (error) {
      if (raise) {
        throw new Error(`Failed to ensure namespace: ${name} - ${error.message}`);
      }
    }
  }
}