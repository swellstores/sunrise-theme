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

  document.createElement("slideshow-button-prev").constructor !== HTMLElement &&
    customElements.define("slideshow-button-prev", SlideshowButtonPrev);
  document.createElement("slideshow-button-next").constructor !== HTMLElement &&
    customElements.define("slideshow-button-next", SlideshowButtonNext);
})();
