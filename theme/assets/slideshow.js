class e extends HTMLElement {
  constructor() {
    super(), this.addEventListener("click", this.prev);
  }
  prev() {
    document.querySelector("swiper-container").swiper.slidePrev();
  }
}
class t extends HTMLElement {
  constructor() {
    super(), this.addEventListener("click", this.next);
  }
  next() {
    document.querySelector("swiper-container").swiper.slideNext();
  }
}
customElements.define("slideshow-button-prev", e),
  customElements.define("slideshow-button-next", t);
