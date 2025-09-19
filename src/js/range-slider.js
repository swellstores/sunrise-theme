import { toNumber } from "./utils/general.js";
import noUiSlider from "./nouislider.min.js";

const TOOLTIP_TAG = "range-slider-tooltip";

export class RangeSlider extends HTMLElement {
  constructor() {
    super();

    this.tooltip = null;

    this.onUpdateBound = this.onUpdate.bind(this);
    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.create();
    this.initTooltip();
  }

  disconnectedCallback() {
    this.destroy();
  }

  get(unencoded = true) {
    const [from, to] = this.noUiSlider.get(unencoded);
    const {
      range: {
        min: [min],
        max: [max],
      },
    } = this.noUiSlider.options;

    return {
      from: toNumber(from),
      to: toNumber(to),
      min: toNumber(min),
      max: toNumber(max),
    };
  }

  getConfig() {
    const { min, max, startMin, startMax, step } = this.dataset;

    return {
      min: toNumber(min),
      max: toNumber(max),
      startMin: toNumber(startMin),
      startMax: toNumber(startMax),
      step: toNumber(step, 1),
    };
  }

  create() {
    const { min, max, startMin, startMax, step } = this.getConfig();

    noUiSlider.create(this, {
      start: [startMin, startMax],
      connect: true,
      margin: 1,
      step,
      range: {
        min: [min],
        max: [max],
      },
    });

    this.noUiSlider.on("change", this.onChangeBound);
    this.noUiSlider.on("update", this.onUpdateBound);
  }

  destroy() {
    this.noUiSlider.destroy();
  }

  initTooltip() {
    const { startMin, startMax } = this.dataset;

    customElements.whenDefined(TOOLTIP_TAG).then(() => {
      this.tooltip = this.querySelector(TOOLTIP_TAG);

      if (this.tooltip) {
        this.tooltip.update(startMin, startMax);
      }
    });
  }

  onUpdate([from, to]) {
    if (!this.tooltip) {
      return null;
    }

    this.tooltip.update(from, to);
  }

  onChange([from, to]) {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          from,
          to,
        },
        bubbles: true,
      })
    );
  }
}

export class RangeSliderTooltip extends HTMLElement {
  formatValue(value) {
    const { format } = this.dataset;

    return format.replace(/{{.*?}}/, toNumber(value));
  }

  format(from, to) {
    const { format } = this.dataset;

    if (!format) {
      return null;
    }

    return `${this.formatValue(from)} - ${this.formatValue(to)}`;
  }

  update(from, to) {
    this.textContent = this.format(from, to);
  }
}
