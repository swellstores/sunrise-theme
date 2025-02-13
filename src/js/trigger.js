/**
 *
 *
 * @export
 * @class Trigger
 * @extends {HTMLElement}
 */
export class Trigger extends HTMLElement {
  constructor() {
    super();
    this.target = this.querySelector('trigger-root');
    this.init();
  }

  init() {
    this.addEventListener('click', () => {
      if (this.target) {
        this.target.classList.toggle('hidden');
      }
    });
  }
}
