(function () {
  /**
   *
   *
   * @class Accordion
   * @extends {HTMLElement}
   */
  class Accordion extends HTMLElement {
    constructor() {
      super();
      this.triggers = this.querySelectorAll('accordion-trigger');
      this.targets = this.querySelectorAll('accordion-content');
      this.icon = this.querySelector('ion-icon');
      this.ids = 0;
      this.activeTrigger = null;
      this.activeContent = null;
      this.init();
    }

    init() {
      this.triggers.forEach((trigger, index) => {
        const id = `accordion-trigger-${this.ids++}`;
        trigger.setAttribute('id', id);
        trigger.setAttribute('aria-controls', id);
        this.targets[index].setAttribute('aria-labelledby', id);
        trigger.addEventListener('click', () => {
          this.activeTrigger = trigger;
          this.activeContent = this.targets[index];
          this.toggle();
        });
      });
    }

    toggle() {
      if (!this.activeTrigger) return;
      if (this.activeTrigger.getAttribute('aria-expanded') === 'false') {
        this.open();
      } else {
        this.close();
      }
    }

    open() {
      if (!this.activeTrigger || !this.activeContent || !this.icon) return;
      this.activeTrigger.setAttribute('aria-expanded', 'true');
      this.activeContent.classList.remove('grid-rows-[0fr]', 'opacity-0');
      this.activeContent.classList.add('grid-rows-[1fr]', 'opacity-100', 'pb-3');
      if (this.icon instanceof HTMLElement) this.icon.style.transform = 'rotate(180deg)';
    }

    close() {
      if (!this.activeTrigger || !this.activeContent) return;
      this.activeTrigger.setAttribute('aria-expanded', 'false');
      this.activeContent.classList.remove('grid-rows-[1fr]', 'opacity-100', 'pb-3');
      this.activeContent.classList.add('grid-rows-[0fr]', 'opacity-0');
      if (this.icon instanceof HTMLElement) this.icon.style.transform = '';
    }
  }

  customElements.define('accordion-root', Accordion);
})();
