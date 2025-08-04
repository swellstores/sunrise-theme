import {
  ProductOptionChangeEvent,
  ProductOptionGiftcardSendToggleEvent,
} from "./utils/events";

export class ProductOptionGiftcard extends HTMLElement {
  constructor() {
    super();

    this.optionId = null;
    this.name = "";
    this.value = "";
    this.valueId = null;
    this.error = null;

    this.send = null;
    this.sendFields = null;
    this.sendEmail = null;
    this.sendNote = null;

    this.onChangeBound = this.onChange.bind(this);
    this.onToggleGiftcardSendBound = this.onToggleGiftcardSend.bind(this);
  }

  connectedCallback() {
    const { optionId, optionName } = this.dataset;

    this.optionId = optionId;
    this.name = optionName;
    this.send = this.querySelector("giftcard-send");
    this.sendFields = this.querySelector("giftcard-send-fields");
    this.sendEmail = this.querySelector("giftcard-send-email");
    this.sendNote = this.querySelector("giftcard-send-note");
    this.error = this.querySelector("option-error");

    const selected = this.querySelector("[selected]");

    if (selected) {
      this.value = selected.getAttribute("value");
      this.valueId = selected.dataset.valueId;
    }

    this.addEventListener("change", this.onChangeBound);
    this.addEventListener(
      ProductOptionGiftcardSendToggleEvent.type,
      this.onToggleGiftcardSendBound
    );
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
    this.removeEventListener(
      ProductOptionGiftcardSendToggleEvent.type,
      this.onToggleGiftcardSendBound
    );
  }

  get() {
    return [
      {
        id: this.optionId,
        name: this.name,
        value: this.value,
        value_id: this.valueId,
      },
      ...this.getSendValues(),
    ];
  }

  valid() {
    return this.isOptionValueValid() && this.areSendValuesValid();
  }

  validate() {
    if (this.valid()) {
      this.hideError();

      return true;
    }

    if (!this.isOptionValueValid()) {
      this.showError();
    }

    this.validateSendValues();

    return false;
  }

  isSendEnabled() {
    return Boolean(this.send?.get());
  }

  getSendValues() {
    if (!this.isSendEnabled()) {
      return [];
    }

    const values = [];

    if (this.sendEmail) {
      const sendEmail = this.sendEmail.get();

      values.push({ id: "send_email", value: sendEmail });
    }

    if (this.sendNote) {
      const sendNote = this.sendNote.get();

      values.push({ id: "send_note", value: sendNote });
    }

    return values;
  }

  isOptionValueValid() {
    return Boolean(this.value) && Boolean(this.valueId);
  }

  areSendValuesValid() {
    if (!this.isSendEnabled()) {
      return true;
    }

    return Boolean(this.sendEmail?.valid());
  }

  validateSendValues() {
    if (!this.isSendEnabled()) {
      return;
    }

    this.sendEmail?.validate();
  }

  showError() {
    if (this.error) {
      this.error.classList.remove("hidden");
    }
  }

  hideError() {
    if (this.error) {
      this.error.classList.add("hidden");
    }
  }

  onToggleGiftcardSend(event) {
    event.stopPropagation();

    if (!this.sendFields || !this.send) {
      return;
    }

    const { value: show } = event.detail;

    this.send.classList.add("pointer-events-none");

    if (show) {
      this.sendFields.classList.remove("hidden");

      const height = this.sendFields.scrollHeight;

      this.sendFields.style.height = "0px";

      requestAnimationFrame(() => {
        this.sendFields.style.height = `${height}px`;
      });

      this.sendFields.addEventListener(
        "transitionend",
        () => {
          this.sendFields.style.height = "auto";
          this.send.classList.remove("pointer-events-none");
        },
        { once: true }
      );
    } else {
      this.sendEmail?.clear();
      this.sendNote?.clear();

      const height = this.sendFields.scrollHeight;

      this.sendFields.style.height = `${height}px`;

      requestAnimationFrame(() => {
        this.sendFields.style.height = "0px";
      });

      this.sendFields.addEventListener(
        "transitionend",
        () => {
          this.sendFields.classList.add("hidden");
          this.send.classList.remove("pointer-events-none");
        },
        { once: true }
      );
    }
  }

  onChange(event) {
    event.stopPropagation();

    if (event.detail?.id !== "giftcard-options-dropdown") {
      return;
    }

    const {
      value,
      dataset: { valueId },
    } = event.detail;

    this.value = value;
    this.valueId = valueId;

    this.dispatchOptionChangeEvent();
  }

  dispatchOptionChangeEvent() {
    const data = this.get();
    const event = new ProductOptionChangeEvent(data);

    this.dispatchEvent(event);
  }
}

export class GiftcardSend extends HTMLElement {
  constructor() {
    super();

    this.value = false;
    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    return this.value;
  }

  onChange(event) {
    event.stopPropagation();

    const { value } = event.detail;

    this.value = Boolean(value);

    this.dispatchGiftcardSendToggleEvent();
  }

  dispatchGiftcardSendToggleEvent() {
    const event = new ProductOptionGiftcardSendToggleEvent({
      value: this.get(),
    });

    this.dispatchEvent(event);
  }
}

export class GiftcardSendEmail extends HTMLElement {
  constructor() {
    super();

    this.input = null;
    this.error = null;

    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.input = this.querySelector('input[type="email"]');
    this.error = this.querySelector("giftcard-send-email-error");

    this.addEventListener("change", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("change", this.onChangeBound);
  }

  get() {
    return this.input?.value;
  }

  clear() {
    if (!this.input) {
      return;
    }

    this.input.value = "";
    this.hideError();
  }

  valid() {
    const value = this.get();

    return value && this.input.validity.valid;
  }

  validate() {
    if (this.valid()) {
      this.hideError();

      return true;
    }

    this.showError();

    return false;
  }

  showError() {
    if (this.error) {
      this.error.classList.remove("hidden");
    }
  }

  hideError() {
    if (this.error) {
      this.error.classList.add("hidden");
    }
  }

  onChange(event) {
    event.stopPropagation();

    this.validate();
  }
}

export class GiftcardSendNote extends HTMLElement {
  constructor() {
    super();

    this.input = null;
    this.sendNoteCount = null;
    this.onChangeBound = this.onChange.bind(this);
  }

  connectedCallback() {
    this.input = this.querySelector("textarea");
    this.sendNoteCount = this.querySelector("giftcard-send-note-count");

    this.addEventListener("input", this.onChangeBound);
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.onChangeBound);
  }

  get() {
    return this.input?.value;
  }

  clear() {
    if (!this.input) {
      return;
    }

    this.input.value = "";
    this.updateSendNoteCount("");
  }

  updateSendNoteCount(value) {
    if (this.sendNoteCount) {
      this.sendNoteCount.update(value);
    }
  }

  onChange(event) {
    event.stopPropagation();

    const value = this.get();

    this.updateSendNoteCount(value);
  }
}

export class GiftcardSendNoteCount extends HTMLElement {
  update(value) {
    this.textContent = value.length;
  }
}
