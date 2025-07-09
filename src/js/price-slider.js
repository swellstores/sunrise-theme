import noUiSlider from "nouislider";

export function initPriceSliders() {
  document.querySelectorAll(".price-slider").forEach(function (container) {
    const min = parseFloat(container.dataset.min) || 0;
    const max = parseFloat(container.dataset.max) || 1000;
    const startMin = parseFloat(container.dataset.startMin) || min;
    const startMax = parseFloat(container.dataset.startMax) || max;
    const step = parseFloat(container.dataset.step) || 1;
    const currencySymbol = container.dataset.currencySymbol || "$";

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

    // Check if slider is already initialized
    if (sliderTrack.noUiSlider) {
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
      margin: 1,
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return Number(value);
        },
      },
    });

    function updateValuePositions() {
      const values = sliderTrack.noUiSlider.get();
      const minSliderValue = values[0];
      const maxSliderValue = values[1];

      const sliderWidth = sliderTrack.offsetWidth;
      const range = sliderTrack.noUiSlider.options.range;
      const rangeMin = range.min;
      const rangeMax = range.max;
      const maxValueBuffer = 4;

      // Update min value position (left handle)
      const minPercentage =
        ((minSliderValue - rangeMin) / (rangeMax - rangeMin)) * 100;
      const minPositionInPixels = (minPercentage / 100) * sliderWidth;
      minValue.style.left = minPositionInPixels + "px";

      if (minSliderValue <= rangeMin) {
        // At minimum - left align with handle
        minValue.style.transform = "translateX(-20%)";
      } else {
        // otherwise center above handle
        minValue.style.transform = "translateX(-40%)";
      }

      // Update max value position (right handle)
      const maxPercentage =
        ((maxSliderValue - rangeMin) / (rangeMax - rangeMin)) * 100;
      const maxPositionInPixels = (maxPercentage / 100) * sliderWidth;
      maxValue.style.left = maxPositionInPixels + "px";

      if (maxSliderValue >= rangeMax - maxValueBuffer) {
        // At maximum - right align with handle
        maxValue.style.transform = "translateX(-68%)";
      } else {
        // otherwise center above handle
        maxValue.style.transform = "translateX(-40%)";
      }
    }

    sliderTrack.noUiSlider.on("update", function (values, handle) {
      const minVal = Math.round(values[0]);
      const maxVal = Math.round(values[1]);

      minValue.textContent = `${currencySymbol}${minVal}`;
      maxValue.textContent = `${currencySymbol}${maxVal}`;

      inputMin.value = minVal;
      inputMax.value = maxVal;

      updateValuePositions();
    });

    const resizeObserver = new ResizeObserver(() => {
      if (container.offsetWidth > 0) {
        updateValuePositions();
      }
    });
    resizeObserver.observe(container);

    sliderTrack.noUiSlider.on("set", function () {
      updateValuePositions();

      const changeEvent = new Event("change", { bubbles: true });
      inputMin.dispatchEvent(changeEvent);
      inputMax.dispatchEvent(changeEvent);

      const containerChangeEvent = new Event("change", { bubbles: true });
      container.dispatchEvent(containerChangeEvent);

      const event = new CustomEvent("priceSliderChanged", {
        detail: {
          min: inputMin.value,
          max: inputMax.value,
        },
      });
      container.dispatchEvent(event);
    });

    const initialValues = sliderTrack.noUiSlider.get();
    const initialMin = Math.round(initialValues[0]);
    const initialMax = Math.round(initialValues[1]);

    minValue.textContent = `${currencySymbol}${initialMin}`;
    maxValue.textContent = `${currencySymbol}${initialMax}`;
    inputMin.value = initialMin;
    inputMax.value = initialMax;

    updateValuePositions();
  });
}

export function updatePriceSliders() {
  document.querySelectorAll(".price-slider").forEach(function (container) {
    const sliderTrack = container.querySelector(".slider-track");
    if (!sliderTrack || !sliderTrack.noUiSlider) {
      return;
    }

    const inputMin = container.querySelector('input[name$="[gte]"]');
    const inputMax = container.querySelector('input[name$="[lte]"]');

    if (!inputMin || !inputMax) {
      return;
    }

    const minValue =
      parseFloat(inputMin.value) || parseFloat(container.dataset.min) || 0;
    const maxValue =
      parseFloat(inputMax.value) || parseFloat(container.dataset.max) || 1000;

    sliderTrack.noUiSlider.set([minValue, maxValue]);
  });
}

window.updatePriceSliders = updatePriceSliders;
