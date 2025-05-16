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

      this.triggers = null;
      this.contents = null;
      this.boundOnToggle = this.onToggle.bind(this);
    }

    connectedCallback() {
      this.triggers = this.querySelectorAll("accordion-trigger");
      this.contents = this.querySelectorAll("accordion-content");

      this.triggers.forEach((trigger, index) => {
        const id = `accordion-trigger-${index}`;
        const content = this.contents[index];

        trigger.setAttribute("id", id);
        trigger.setAttribute("data-index", String(index));
        trigger.setAttribute("aria-controls", id);
        content.setAttribute("aria-labelledby", id);

        trigger.addEventListener("click", this.boundOnToggle);
      });
    }

    disconnectedCallback() {
      this.triggers.forEach((trigger) => {
        trigger.removeEventListener("click", this.boundOnToggle);
      });
    }

    onToggle(event) {
      event.preventDefault();

      const trigger = event.currentTarget;
      const index = Number(trigger.dataset.index);
      const content = this.contents[index];

      if (!content) {
        return;
      }

      const icon = trigger.querySelector("ion-icon") || trigger.querySelector("chevron-icon");
      const shouldExpand = trigger.getAttribute("aria-expanded") === "false";

      return shouldExpand
        ? this.open(trigger, content, icon)
        : this.close(trigger, content, icon);
    }

    open(trigger, content, icon) {
      trigger.setAttribute("aria-expanded", "true");
      content.classList.remove("grid-rows-[0fr]", "opacity-0");
      content.classList.add("grid-rows-[1fr]", "opacity-100", "pb-3");

      if (icon instanceof HTMLElement) {
        icon.style.transform = "rotate(180deg)";
      }
    }

    close(trigger, content, icon) {
      trigger.setAttribute("aria-expanded", "false");
      content.classList.add("grid-rows-[0fr]", "opacity-0");
      content.classList.remove("grid-rows-[1fr]", "opacity-100", "pb-3");

      if (icon instanceof HTMLElement) {
        icon.style.transform = "";
      }
    }
  }

  customElements.define("accordion-root", Accordion);
})();
