# Turtle library
[![Build Turtle](https://github.com/smtdfc/Turtle/actions/workflows/webpack.yml/badge.svg)](https://github.com/smtdfc/Turtle/actions/workflows/webpack.yml)

*Simple library for build UI*
***
- Build Turtle
  Execute the following command on your terminal :
  ```
     npm run build
  ```
  Include Turtle in your project :
    
  + **Script**
  ``` html
    <script src="path/dist/turtle.min.js"></script>
  ```

- Create new app

  ``` javascript
  const app = new Turtle.createApp(document.getElementById("root"))
  app.render(`
    <h1>Hello world<\h1>
  `)
  ```

- Create component

  ``` javascript
  const app = new Turtle.createApp(document.getElementById("root"))
  const Box = app.createComponent(class extends Turtle.TurtleComponent{
    template(){
      return this.html`
         <h1>Hello world<\h1>    
      `
    }
  })
  
  app.render(`
    <${Box}/>
  `)
  ```

