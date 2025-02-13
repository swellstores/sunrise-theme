class Accordion extends HTMLElement {
  constructor() {
    super();
    this.triggers = this.querySelectorAll("accordion-trigger");
    this.targets = this.querySelectorAll("accordion-content");
    this.ids = 0;
    this.activeTrigger = null;
    this.activeContent = null;
    this.init();
  }

  init() {
    this.triggers.forEach((trigger, index) => {
      const id = `accordion-trigger-${this.ids++}`;
      trigger.setAttribute("id", id);
      trigger.setAttribute("aria-controls", id);
      this.targets[index].setAttribute("aria-labelledby", id);

      if (trigger.getAttribute("aria-expanded") === "true") {
        this.applyBackground(trigger);
      }

      trigger.addEventListener("click", () => {
        this.activeTrigger = trigger;
        this.activeContent = this.targets[index];
        this.toggle();
      });
    });
  }

  toggle() {
    if (!this.activeTrigger) return;

    if (this.activeTrigger.getAttribute("aria-expanded") === "false") {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (!this.activeTrigger || !this.activeContent) return;

    this.activeTrigger.setAttribute("aria-expanded", "true");

    this.activeContent.classList.remove("grid-rows-[0fr]", "opacity-0");
    this.activeContent.classList.add("grid-rows-[1fr]", "opacity-100");

    this.applyBackground(this.activeTrigger);

    const icon = this.activeTrigger.querySelector("ion-icon");
    if (icon) icon.style.transform = "rotate(180deg)";
  }

  close() {
    if (!this.activeTrigger || !this.activeContent) return;

    this.activeTrigger.setAttribute("aria-expanded", "false");

    this.activeContent.classList.remove("grid-rows-[1fr]", "opacity-100");
    this.activeContent.classList.add("grid-rows-[0fr]", "opacity-0");

    this.removeBackground(this.activeTrigger);

    const icon = this.activeTrigger.querySelector("ion-icon");
    if (icon) icon.style.transform = "";
  }

  applyBackground(trigger) {
    const parentDiv = trigger.closest(".w-full.overflow-hidden");
    const accordionRoot = trigger.closest("accordion-root");
    const bgColor = accordionRoot.getAttribute("data-bg-color") || "#FAF7FF";

    if (parentDiv) parentDiv.style.backgroundColor = bgColor;
  }

  removeBackground(trigger) {
    const parentDiv = trigger.closest(".w-full.overflow-hidden");
    if (parentDiv) parentDiv.style.backgroundColor = "";
  }
}

customElements.define("accordion-root", Accordion);
