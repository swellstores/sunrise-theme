// @ts-nocheck

import { computePosition } from "@floating-ui/dom";
import { uiManager } from "./utils/ui-manager";

const INACTIVE_CLASSES = [
  "opacity-0",
  "-translate-y-full",
  "pointer-events-none",
];

/**
 *
 *
 * @export
 * @class SearchDialog
 * @extends {HTMLElement}
 */
export class SearchDialog extends HTMLElement {
  constructor() {
    super();
    this.backdropOverlay = document.querySelector("backdrop-root");
    this.searchInput = this.querySelector("input[type=search]");
    this.triggers = document.querySelectorAll("search-trigger");
    this.body = document.body;
    this.header = document.querySelector("header");
    this.init();
  }

  init() {
    this.triggers.forEach((button) => {
      button.addEventListener("click", () => {
        if (JSON.parse(this.getAttribute("aria-hidden"))) {
          uiManager.open(this);
        } else {
          uiManager.close(this);
        }
      });
    });

    if (!!this.getAttribute("aria-hidden")) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          uiManager.close(this);
        }
      });
    }

    document.addEventListener("click", (event) => {
      if (
        !this.contains(event.target) &&
        !Array.from(this.triggers).some((trigger) =>
          trigger.contains(event.target)
        )
      ) {
        uiManager.close(this);
      }
    });
  }

  open() {
    if (!JSON.parse(this.getAttribute("aria-hidden"))) return;
    this.body.classList.add("overflow-hidden");
    this.setAttribute("aria-hidden", "false");
    this.backdropOverlay?.classList.remove("translate-x-full");

    for (const className of INACTIVE_CLASSES) {
      if (this.classList.contains(className)) {
        this.classList.remove(className);
      }
    }

    this.computePosition();
    this.searchInput?.focus();
  }

  close() {
    if (!!JSON.parse(this.getAttribute("aria-hidden"))) return;
    this.body.classList.remove("overflow-hidden");
    this.setAttribute("aria-hidden", "true");
    this.backdropOverlay?.classList.add("translate-x-full");

    for (const className of INACTIVE_CLASSES) {
      if (!this.classList.contains(className)) {
        this.classList.add(className);
      }
    }
  }

  // Compute the `top` position of the search dialog
  async computePosition() {
    const header = this.header;

    if (!header) return;

    const { x, y } = await computePosition(header, this, {
      placement: "bottom",
    });

    Object.assign(this.style, {
      top: `${y}px`,
    });
  }
}
