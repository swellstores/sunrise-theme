import { toNumber } from "./utils/general.js";
import noUiSlider from "./nouislider.min.js";

export class RangeSlider extends HTMLElement {
  constructor() {
    super();

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.create();
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

    return { from, to, min, max };
  }

  getTooltipConfig() {
    const { tooltipFormat } = this.dataset;

    if (!tooltipFormat) {
      return null;
    }

    return {
      to: (value) => tooltipFormat.replace(/{{.*?}}/, value),
    };
  }

  getConfig() {
    const { min, max, startMin, startMax, step } = this.dataset;
    const tooltipConfig = this.getTooltipConfig();
    const config = {
      min: toNumber(min),
      max: toNumber(max),
      startMin: toNumber(startMin),
      startMax: toNumber(startMax),
      step: toNumber(step, 1),
    };

    if (tooltipConfig) {
      config.tooltips = [tooltipConfig, tooltipConfig];
    }

    return config;
  }

  create() {
    const { min, max, startMin, startMax, step, tooltips } = this.getConfig();

    noUiSlider.create(this, {
      start: [startMin, startMax],
      connect: true,
      margin: 1,
      step,
      range: {
        min: [min],
        max: [max],
      },
      tooltips,
    });

    this.noUiSlider.on("change", this.onChangeBound);
  }

  destroy() {
    this.noUiSlider.destroy();
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
