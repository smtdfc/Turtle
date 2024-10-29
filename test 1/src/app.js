import {setupRouter} from './router/init.js';
import {Navbar} from './components/Navbar.js';
import {AppContainer} from './components/AppContainer.js';

const app = Turtle.createApp(document.getElementById("root"))

function initApp(){
  
  app.render`
    <${Navbar}/>
    <${AppContainer}/>
  `
  setupRouter(app)
}

initApp()