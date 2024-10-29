class Component extends Turtle.TurtleComponent {
  template() {
    return this.html`
      <div>
      $[[$[$[$[$[$]]]]]]
      </div>
    `
  }
}

export const Page = Turtle.createComponent(Component)