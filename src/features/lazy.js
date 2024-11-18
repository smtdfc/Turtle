import { TurtleComponent, createComponent } from "../component/component.js";

export class TurtleLazyLoadingComponent extends TurtleComponent {
  onCreate() {
    if (this.props[0]) {
      this.lazy_fn = this.props[0]
    }
  }

  onRender() {

    let context = this
    this.lazy_fn()
      .then((component) => {
        context.element.appendChild(this.html`
          <${component}/>
        `)
      })
  }

  template() {
    return this.html``
  }

}

export const Lazy = createComponent(TurtleLazyLoadingComponent)