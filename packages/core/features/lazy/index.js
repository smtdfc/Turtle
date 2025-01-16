import { TurtleComponent } from "../../component/base.js";

export const Lazy = new TurtleComponent({
  onRender: function() {
    let [callback] = this.props;

    callback()
      .then(function(component) {
        this.clear();
        this._element.appendChild(this.html`
          <${component}/>
        `);
      }.bind(this))
      .catch(function(error) {
        console.error("Error in Lazy:", error);
      });
  },

  template: function() {
    let [, placeholder] = this.props;
    if (placeholder) {
      return this.html`
        <${placeholder}/>
      `;
    } else {
      return this.html``;
    }
  }
});

export const LazyVisible = createComponent({
  onRender: function() {
    let [placeholder, component] = this.props;

    const observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(async function(entry) {
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
      }.bind(this));
    }.bind(this));

    observer.observe(this._element);
  },

  template: function() {
    let [, placeholder] = this.props;
    return placeholder ?
      this.html`<${placeholder}/>` :
      this.html``;
  }
});