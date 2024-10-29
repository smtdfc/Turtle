class Component extends Turtle.TurtleComponent {
  template() {
    return this.html`
      <div class="offcanvas offcanvas-left">
        <div class="navbar-brand">
          <button class="p-1 navbar-btn-toggle btn-icon material-symbols-outlined">menu</button>
          <h3 class="header-4">smtdfc GeneAnalyis</h3>
        </div>
      </div>
    `
  }
}

export const Offcanvas = Turtle.createComponent(Component)