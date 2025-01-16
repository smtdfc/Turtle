import { TurtleComponent, createComponent } from "../../component/component.js";

export const Lazy = createComponent(class TurtleLazyComponent extends TurtleComponent {
  onRender() {
    let [callback] = this.props;

    callback()
      .then((component) => {
        this.clear()
        this._element.appendChild(this.html`
          <${component}/>
        `);
      })
  }

  template() {
    let [, placeholder] = this.props
    if (placeholder) {
      return this.html`
        <${placeholder}/>
      `;
    } else {
      return this.html``;
    }
  }
});

export const LazyVisible = createComponent(
  class TurtleLazyVisibleComponent extends TurtleComponent {
    onRender() {
      let [placeholder, component] = this.props;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            try {
              this.clear();
              if (component) {
                this._element.appendChild(
                  this.html`
                    <${component}/>
                  `
                );
              }
              obs.disconnect();
            } catch (error) {
              console.error("Error in TurtleLazyVisible:", error);
              this.clear();
            }
          }
        });
      });

      observer.observe(this._element);
    }

    template() {
      let [, placeholder] = this.props;
      return placeholder 
        ? this.html`<${placeholder}/>` 
        : this.html``;
    }
  }
);