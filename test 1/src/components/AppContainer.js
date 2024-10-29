class Component extends Turtle.TurtleComponent {
  template() {
    return this.html`
      <div id="content"/>
    `
  }
}

export const AppContainer = Turtle.createComponent(Component)