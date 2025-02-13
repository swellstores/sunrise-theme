!(function () {
  class e extends HTMLElement {
    constructor() {
      super(),
        (this.container =
          this?.parentElement?.querySelector("swiper-container")),
        this.addEventListener("click", this.prev.bind(this));
    }
    prev() {
      this.container && this.container.swiper.slidePrev();
    }
  }
  class t extends HTMLElement {
    constructor() {
      super(),
        (this.container =
          this?.parentElement?.querySelector("swiper-container")),
        this.addEventListener("click", this.next.bind(this));
    }
    next() {
      this.container && this.container.swiper.slideNext();
    }
  }
  customElements.define("slideshow-button-prev", e),
    customElements.define("slideshow-button-next", t);
})();
