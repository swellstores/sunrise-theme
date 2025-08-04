export class AccountSubscription extends HTMLElement {
  constructor() {
    super();

    this.busy = false;
    this.mainArea = null;
    this.subscriptionId = null;
    this.subscriptionDatePeriodEnd = null;
    this.pauseButton = null;
    this.pauseCycleButton = null;
    this.resumeButton = null;
    this.cancelButton = null;
    this.errorText = null;
    this.cancelWarningText = null;

    this.onPauseBound = this.onPause.bind(this);
    this.onPauseCycleBound = this.onPauseCycle.bind(this);
    this.onResumeBound = this.onResume.bind(this);
    this.onCancelBound = this.onCancel.bind(this);
  }

  connectedCallback() {
   this.getSelectors();
  }

  disconnectedCallback() {
    this.clearSelectors();
  }

  getSelectors() {
    this.mainArea = this.querySelector("#main-area");
    this.subscriptionId = this.querySelector("input[name='subscription-id']");
    this.subscriptionDatePeriodEnd = this.querySelector("input[name='subscription-date-period-end']");
    this.cancelWarningText = this.querySelector("input[name='cancel-warning-text']");
    this.pauseButton = this.querySelector("button[name='pause-subscription']");
    if (this.pauseButton) {
      this.pauseButton.addEventListener("click", this.onPauseBound);
    }
    this.pauseCycleButton = this.querySelector("button[name='pause-cycle-subscription']");
    if (this.pauseCycleButton) {
      this.pauseCycleButton.addEventListener("click", this.onPauseCycleBound);
    }
    this.resumeButton = this.querySelector("button[name='resume-subscription']");
    if (this.resumeButton) {
      this.resumeButton.addEventListener("click", this.onResumeBound);
    }
    this.cancelButton = this.querySelector("button[name='cancel-subscription']");
    if (this.cancelButton) {
      this.cancelButton.addEventListener("click", this.onCancelBound);
    }
    this.errorText = this.querySelector("div#error");
  }

  clearSelectors() {
    if (this.pauseButton) {
      this.pauseButton.removeEventListener("click", this.onPauseBound);
    }
    if (this.pauseCycleButton) {
      this.pauseCycleButton.removeEventListener("click", this.onPauseCycleBound);
    }
    if (this.resumeButton) {
      this.resumeButton.removeEventListener("click", this.onResumeBound);
    }
    if (this.cancelButton) {
      this.cancelButton.removeEventListener("click", this.onCancelBound);
    }

    this.mainArea = null;
    this.subscriptionId = null;
    this.subscriptionDatePeriodEnd = null;
    this.pauseButton = null;
    this.pauseCycleButton = null;
    this.resumeButton = null;
    this.cancelButton = null;
    this.errorText = null;
    this.cancelWarningText = null;
  }

  setBusy() {
    this.busy = true;
    if (this.mainArea) {
      this.mainArea.style.opacity = 0.5;
    }
    if (this.errorText) {
      this.errorText.style.display = 'none';
    }
  }

  setNotBusy() {
    this.busy = false;
    if (this.mainArea) {
      this.mainArea.style.opacity = 1;
    }
  }

  onPause() {
   this.handleButton({
      paused: true,
      date_pause_end: null,
    });
  }

  onPauseCycle() {
    this.handleButton({
      paused: true,
      date_pause_end: this.subscriptionDatePeriodEnd?.value,
    });
  }

  onResume() {
    this.handleButton({
      paused: false,
      date_pause_end: null,
    });
  }

  onCancel() {
    if (!this.cancelWarningText?.value) {
      return;
    }

    const warningText = this.cancelWarningText.value;
    if (!confirm(warningText)) {
      return;
    }

    this.handleButton({
      canceled: true,
    });
  }

  handleButton(params = {}) {
    if (this.busy || !this.subscriptionId) {
      return;
    }

    const id = this.subscriptionId.value;
    if (!id) {
      return;
    }

    // lock buttons
    this.setBusy();
    this.subscriptionRequest(id, params);
  }

  async subscriptionRequest(id, params) {
    try {
      // main request
      const actionResponse = await fetch(`/account/subscriptions/${id}`, {
        method: "PUT",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Swell-Raw-Data": "true",
        },
        body: JSON.stringify(params),
      });

      if (!actionResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const text = await actionResponse.text();

      const parser = new DOMParser();
      const html = parser.parseFromString(text, "text/html");
      const newContent = html.querySelector("account-subscription");
      if (newContent) {
        this.clearSelectors();
        this.setNotBusy();
        this.innerHTML = newContent.innerHTML;
        this.getSelectors();
        return;
      }

      this.setNotBusy();
    } catch (error) {
      console.error("Error during updating subscription:", error);
      if (this.errorText) {
        this.errorText.style.display = 'block';
      }
      this.setNotBusy();
    }
  }
}
