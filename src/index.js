export * from "./app/index.js"
export * from "./component/index.js"
export * from "./context/context.js"
export * from "./modules/index.js"
export * from "./features/index.js"


if(!window.__TURTLE__){
  
  window.__TURTLE__ ={
    devMode:false,
    version:"3"
  }
}