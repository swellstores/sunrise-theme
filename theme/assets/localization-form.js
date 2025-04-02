class LocalizationForm extends HTMLElement {
  constructor() {
    super();

    this.elements = {
      modal: this.querySelector('[data-modal="localization"]'),

      localizationButtons: this.querySelectorAll(
        "button[data-target=\"[data-modal='localization']\"]"
      ),

      languageInput: this.querySelector("input[name='locale_code']"),
      languageSelector: this.querySelector("button#language-selector"),
      languageSelectorText: null,
      languageList: this.querySelector('ul.language-list[role="list"]'),
      languageListItems: null,

      currencyInput: this.querySelector("input[name='country_code']"),
      currencySelector: this.querySelector("button#currency-selector"),
      currencySelectorText: null,
      currencyList: this.querySelector('ul.currency-list[role="list"]'),
      currencyListItems: null,
    };
    this.languageOptions = [];
    this.currencyOptions = [];

    this.initLocalizationButtons();
    this.initLanguageSelector();
    this.initCurrencySelector();
  }

  initLocalizationButtons() {
    this.elements.localizationButtons.forEach((button) => {
      button.addEventListener("click", this.toggleModal.bind(this));
    });
  }

  initLanguageSelector() {
    this.initLanguageButton();
    this.initLanguageListItems();
  }

  initCurrencySelector() {
    this.initCurrencyButton();
    this.initCurrencyListItems();
  }

  initLanguageButton() {
    if (!this.elements.languageSelector) {
      return;
    }

    this.elements.languageSelectorText =
      this.elements.languageSelector.querySelector(".language-button__text");

    this.defaultLanguageOption = {
      label: this.elements.languageSelectorText.innerText,
      value: this.elements.languageSelector.getAttribute("data-value"),
    };

    this.elements.languageSelector.addEventListener(
      "click",
      this.toggleLanguageList.bind(this)
    );
  }

  initCurrencyButton() {
    if (!this.elements.currencySelector) {
      return;
    }

    this.elements.currencySelectorText =
      this.elements.currencySelector.querySelector(".currency-button__text");

    this.defaultCurrencyOption = {
      label: this.elements.currencySelectorText.innerText,
      value: this.elements.currencySelector.getAttribute("data-value"),
    };

    this.elements.currencySelector.addEventListener(
      "click",
      this.toggleCurrencyList.bind(this)
    );
  }

  initLanguageListItems() {
    const languageItems = this.querySelectorAll("a.language-list__item");

    this.elements.languageListItems = languageItems;

    languageItems.forEach((item) => {
      const textElement = item.querySelector(".language-list__item-text");
      const label = textElement.innerText;
      const value = item.getAttribute("data-value");

      this.languageOptions.push({ label, value });

      item.addEventListener("click", this.onSelectLanguage.bind(this));
    });
  }

  initCurrencyListItems() {
    const currencyItems = this.querySelectorAll("a.currency-list__item");

    this.elements.currencyListItems = currencyItems;

    currencyItems.forEach((item) => {
      const textElement = item.querySelector(".currency-list__item-text");
      const label = textElement.innerText;
      const value = item.getAttribute("data-value");

      this.currencyOptions.push({ label, value });

      item.addEventListener("click", this.onSelectCurrency.bind(this));
    });
  }

  toggleModal() {
    this.elements.modal.classList.toggle("hidden");

    this.resetLanguageSelector();
    this.resetCurrencySelector();
  }

  toggleLanguageList() {
    const isExpanded =
      this.elements.languageSelector.getAttribute("aria-expanded") === "true";

    this.elements.languageSelector.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );
    this.elements.languageList.hidden = isExpanded;
  }

  toggleCurrencyList() {
    const isExpanded =
      this.elements.currencySelector.getAttribute("aria-expanded") === "true";

    this.elements.currencySelector.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );
    this.elements.currencyList.hidden = isExpanded;
  }

  onSelectLanguage(event) {
    event.preventDefault();

    const item = event.currentTarget;
    const textElement = item.querySelector(".language-list__item-text");
    const label = textElement.innerText;
    const value = item.getAttribute("data-value");

    item.setAttribute(
      "data-value",
      this.elements.languageSelector.getAttribute("data-value")
    );
    textElement.innerText = this.elements.languageSelectorText.innerText;

    this.elements.languageSelector.setAttribute("data-value", value);
    this.elements.languageSelectorText.innerText = label;

    this.elements.languageInput.value = value;

    this.toggleLanguageList();
  }

  onSelectCurrency(event) {
    event.preventDefault();

    const item = event.currentTarget;
    const textElement = item.querySelector(".currency-list__item-text");
    const label = textElement.innerText;
    const value = item.getAttribute("data-value");

    item.setAttribute(
      "data-value",
      this.elements.currencySelector.getAttribute("data-value")
    );
    textElement.innerText = this.elements.currencySelectorText.innerText;

    this.elements.currencySelector.setAttribute("data-value", value);
    this.elements.currencySelectorText.innerText = label;

    this.elements.currencyInput.value = value;

    this.toggleCurrencyList();
  }

  resetLanguageSelector() {
    if (!this.elements.languageSelector) {
      return;
    }

    const { value, label } = this.defaultLanguageOption;

    this.elements.languageSelector.setAttribute("aria-expanded", "false");
    this.elements.languageSelector.setAttribute("data-value", value);

    this.elements.languageSelectorText.innerText = label;

    this.elements.languageList.hidden = true;

    this.elements.languageListItems.forEach((item, index) => {
      const { label, value } = this.languageOptions[index];

      item.setAttribute("data-value", value);
      item.querySelector(".language-list__item-text").innerText = label;
    });
  }

  resetCurrencySelector() {
    if (!this.elements.currencySelector) {
      return;
    }

    const { value, label } = this.defaultCurrencyOption;

    this.elements.currencySelector.setAttribute("aria-expanded", "false");
    this.elements.currencySelector.setAttribute("data-value", value);

    this.elements.currencySelectorText.innerText = label;

    this.elements.currencyList.hidden = true;

    this.elements.currencyListItems.forEach((item, index) => {
      const { label, value } = this.currencyOptions[index];

      item.setAttribute("data-value", value);
      item.querySelector(".currency-list__item-text").innerText = label;
    });
  }
}

if (!customElements.get("localization-form")) {
  customElements.define("localization-form", LocalizationForm);
}
