(function () {
  /**
   *
   *
   * @class SlideshowButtonPrev
   * @extends {HTMLElement}
   */
  class SlideshowButtonPrev extends HTMLElement {
    constructor() {
      super();
      this.container = this?.parentElement?.querySelector('swiper-container');
      this.addEventListener('click', this.prev.bind(this));
    }

    prev() {
      // @ts-ignore
      if (this.container) this.container.swiper.slidePrev();
    }
  }

  /**
   * Class representing the next slide button
   * @extends {HTMLElement}
   */
  class SlideshowButtonNext extends HTMLElement {
    constructor() {
      super();
      this.container = this?.parentElement?.querySelector('swiper-container');
      this.addEventListener('click', this.next.bind(this));
    }

    next() {
      // @ts-ignore
      if (this.container) this.container.swiper.slideNext();
    }
  }

  if (!customElements.get("slideshow-button-prev")) {
    customElements.define("slideshow-button-prev", SlideshowButtonPrev);
  }
  if (!customElements.get("slideshow-button-next")) {
    customElements.define("slideshow-button-next", SlideshowButtonNext);
  }
})();
