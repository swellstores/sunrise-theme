export class ProductOptions extends HTMLElement {
  get(showValidationError = true) {
    const selectOptions = this.querySelectorAll("product-option-select");
    const toggleOptions = this.querySelectorAll("product-option-toggle");
    const textOptions = this.querySelectorAll("product-option-text");
    const giftcardOptions = this.querySelectorAll("product-option-giftcard");

    return [
      ...Array.from(selectOptions),
      ...Array.from(toggleOptions),
      ...Array.from(textOptions),
      ...Array.from(giftcardOptions),
    ].reduce(
      (acc, option) => {
        const optionData = option.get();
        const valid = showValidationError ? option.validate() : option.valid();

        if (Array.isArray(optionData)) {
          acc.options.push(...optionData);
        } else {
          acc.options.push(optionData);
        }

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
    const giftcardOptions = this.querySelectorAll("product-option-giftcard");

    return [
      ...Array.from(selectOptions),
      ...Array.from(toggleOptions),
      ...Array.from(giftcardOptions),
    ].reduce((acc, option) => {
      if (option.valueId) {
        acc.push(option.valueId);
      }

      return acc;
    }, []);
  }
}
