export * from "./app/index.js"
export * from "./component/index.js"
export * from "./context/context.js"

if(!window.__TURTLE__){
  
  window.__TURTLE__ ={
    devMode:false,
    version:"3"
  }
}