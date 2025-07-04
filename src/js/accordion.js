export class AccordionRoot extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute("role", "presentation");
  }
}

export class AccordionItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute("role", "listitem");

    if (this.hasAttribute("aria-expanded")) {
      const isExpanded = this.getAttribute("aria-expanded").trim() === "true";

      this.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    } else {
      this.setAttribute("aria-expanded", "false");
    }
  }

  toggle() {
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    const content = this.querySelector("accordion-content");

    if (!content) {
      return;
    }

    content.toggle(isExpanded);
    this.setAttribute("aria-expanded", String(!isExpanded));
  }
}

export class AccordionTrigger extends HTMLElement {
  constructor() {
    super();

    this.onClickBound = this.onClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "button");

    this.addEventListener("click", this.onClickBound);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClickBound);
  }

  onClick(event) {
    event.preventDefault();

    const accordionItem = this.closest("accordion-item");

    if (accordionItem) {
      accordionItem.toggle(this);
    }
  }
}

export class AccordionContent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute("role", "region");

    this.classList.add(
      "overflow-hidden",
      "transition-[height]",
      "duration-300",
      "ease-in-out",
      "h-0",
      "hidden"
    );

    const accordionItem = this.closest("accordion-item");

    if (!accordionItem) {
      return;
    }

    const shouldOpen = accordionItem.getAttribute("aria-expanded") === "true";

    if (shouldOpen) {
      this.open();
    }
  }

  toggle(isExpanded) {
    return isExpanded ? this.close() : this.open();
  }

  open() {
    this.style.display = "block";
    const height = this.scrollHeight;
    this.style.height = "0px";

    requestAnimationFrame(() => {
      this.style.height = `${height}px`;
    });

    this.addEventListener(
      "transitionend",
      () => {
        this.style.height = "auto";
      },
      { once: true }
    );
  }

  close() {
    const height = this.scrollHeight;

    this.style.height = `${height}px`;

    requestAnimationFrame(() => {
      this.style.height = "0px";
    });

    this.addEventListener(
      "transitionend",
      () => {
        this.style.display = "none";
      },
      { once: true }
    );
  }
}
