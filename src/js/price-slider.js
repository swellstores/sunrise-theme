import noUiSlider from "nouislider";

export function initPriceSliders() {
  document.querySelectorAll(".price-slider").forEach(function (container) {
    const min = parseFloat(container.dataset.min) || 0;
    const max = parseFloat(container.dataset.max) || 1000;
    const startMin = parseFloat(container.dataset.startMin) || min;
    const startMax = parseFloat(container.dataset.startMax) || max;
    const step = parseFloat(container.dataset.step) || 1;

    let minValue = container.querySelector(".min-value");
    let maxValue = container.querySelector(".max-value");
    if (!minValue || !maxValue) {
      minValue = document.createElement("span");
      minValue.className = "min-value";
      maxValue = document.createElement("span");
      maxValue.className = "max-value";
      container.appendChild(minValue);
      container.appendChild(maxValue);
    }

    // Create hidden inputs for form submission
    let inputMin = container.querySelector('input[name$="[gte]"]');
    let inputMax = container.querySelector('input[name$="[lte]"]');
    if (!inputMin) {
      inputMin = document.createElement("input");
      inputMin.type = "hidden";
      inputMin.name = container.dataset.inputName + "[gte]";
      container.appendChild(inputMin);
    }
    if (!inputMax) {
      inputMax = document.createElement("input");
      inputMax.type = "hidden";
      inputMax.name = container.dataset.inputName + "[lte]";
      container.appendChild(inputMax);
    }

    // Find the slider track div
    const sliderTrack = container.querySelector(".slider-track");
    if (!sliderTrack) {
      return;
    }

    noUiSlider.create(sliderTrack, {
      start: [startMin, startMax],
      connect: true,
      step: step,
      range: {
        min: min,
        max: max,
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return Number(value);
        },
      },
    });

    sliderTrack.noUiSlider.on("update", function (values, handle) {
      const minVal = Math.round(values[0]);
      const maxVal = Math.round(values[1]);
      minValue.textContent = `$${minVal}`;
      maxValue.textContent = `$${maxVal}`;
      inputMin.value = minVal;
      inputMax.value = maxVal;
    });
  });
}
