export class ProductOptions extends HTMLElement {
  get(showValidationError = true) {
    const selectOptions = this.querySelectorAll("product-option-select");
    const toggleOptions = this.querySelectorAll("product-option-toggle");
    const textOptions = this.querySelectorAll("product-option-text");

    return [
      ...Array.from(selectOptions),
      ...Array.from(toggleOptions),
      ...Array.from(textOptions),
    ].reduce(
      (acc, option) => {
        const optionData = option.get();
        const valid = showValidationError ? option.validate() : option.valid();

        acc.options.push(optionData);

        if (!valid) {
          acc.valid = false;
        }

        return acc;
      },
      { options: [], valid: true }
    );
  }

  getValueIds() {
    const selectOptions = this.querySelectorAll("product-option-select");
    const toggleOptions = this.querySelectorAll("product-option-toggle");

    return [...Array.from(selectOptions), ...Array.from(toggleOptions)].reduce(
      (acc, option) => {
        if (option.valueId) {
          acc.push(option.valueId);
        }

        return acc;
      },
      []
    );
  }
}
