window.TURTLE_DERECTIVES = {}

function generateKey() {
   return (Math.floor(Math.random() * 999999) * Date.now()).toString(16)
}

export function props(...args) {
   let key = generateKey()
   window.TURTLE_DERECTIVES[key] = args
   return ` t-props="${key}" `
}

