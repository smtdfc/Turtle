export const directives = {
  "t-html": (context, element, target, value) => {
    context.addHtmlBind(element, value)
  },
  
  "t-show": (context, element, target, value) => {
    context.addShowBind(element, value)
  },
  
  
  "t-ref": (context, element, target, value) => {
    context.addRef(element, value)
  },
  "t-value": (context, element, target, value) => {
    context.addValueBind(element, value)
  },
  
  "t-classname": (context, element, target, value) => {
    context.addClassNameBind(element, value)
  },

  "t-text": (context, element, target, value) => {
    context.addTextBind(element, value)
  },

  "t-model": (context, element, target, value) => {
    context.addModelBind(element, value)
  },

  "t-events": (context, element, target, value) => {
    context.addEventsBind(element, value)
  },

  "t-binds": (context, element, target, value) => {
    context.addAttrsBind(element, value)
  },


}