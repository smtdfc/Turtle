export const directives ={
  "t-html":(context, element,target,value)=>{
    context.addHtmlBind(element,value)
  }
}

