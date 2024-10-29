
export function setupRouter(app){
  let router = app.use(Turtle.TurtleRouterModule,{
    root: document.getElementById("content")
  })
 
  router.routes ={
    "/":{
      loader:async ()=>{return (await import("../pages/home.js")).Page}
    }
  }
  
  router.on("pageloaded",function(){
    console.log(1)
  })
  router.start()
  
}