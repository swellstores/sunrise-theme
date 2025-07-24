const routes = {
  pauseSubscription: "/subscriptions/pause",
  resumeSubscription: "/subscriptions/resume",
  cancelSubscription: "/subscriptions/cancel",
};

export class MainSubscription extends HTMLElement {
  constructor() {
    super();

    this.busy = false;
    this.mainArea = null;
    this.subscriptionId = null;
    this.pauseButton = null;
    this.resumeButton = null;
    this.cancelButton = null;

    this.onPauseBound = this.onPause.bind(this);
    this.onResumeBound = this.onResume.bind(this);
    this.onCancelBound = this.onCancel.bind(this);
  }

  connectedCallback() {
    this.mainArea = this.querySelector("#main-area");
    this.subscriptionId = this.querySelector("input[name='subscription-id']");
    this.pauseButton = this.querySelector("button[name='pause-subscription']");
    if (this.pauseButton) {
      this.pauseButton.addEventListener("click", this.onPauseBound);
    }
    this.resumeButton = this.querySelector("button[name='resume-subscription']");
    if (this.resumeButton) {
      this.resumeButton.addEventListener("click", this.onResumeBound);
    }
    this.cancelButton = this.querySelector("button[name='cancel-subscription']");
    if (this.cancelButton) {
      this.cancelButton.addEventListener("click", this.onCancelBound);
    }
  }

  disconnectedCallback() {
    if (this.pauseButton) {
      this.pauseButton.removeEventListener("click", this.onPauseBound);
    }
    if (this.resumeButton) {
      this.resumeButton.addEventListener("click", this.onResumeBound);
    }
    if (this.cancelButton) {
      this.cancelButton.addEventListener("click", this.onCancelBound);
    }

    this.mainArea = null;
    this.subscriptionId = null;
    this.pauseButton = null;
    this.resumeButton = null;
    this.cancelButton = null;
  }

  setBusy() {
    this.busy = true;
    if (this.mainArea) {
      // opacity
    }
  }

  setNotBusy() {
    this.busy = false;
    if (this.mainArea) {
      // opacity
    }
  }

  async onPause() {
    console.log("on pause");
    const res = await this.handleButton(
      routes.pauseSubscription,
    );
  }

  async onResume() {
   console.log("on resume");
    const res = await this.handleButton(
      routes.resumeSubscription,
    );
  }

  async onCancel() {
    console.log("on cancel");
    const res = await this.handleButton(
      routes.cancelSubscription,
    );
  }

  async handleButton(route, params = {}) {
    if (this.busy || !this.subscriptionId) {
      return;
    }
    const id = this.subscriptionId.value;
    if (!id) {
      return;
    }

    params.id = id;

    this.setBusy();
    await this.subscriptionRequest(route, params);
    this.setNotBusy();
  }

  async subscriptionRequest(route, params) {
    try {
      const response = await fetch(route, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("response is", response);
      const result = await response.json();

      console.log("result=", result);
      // const parser = new DOMParser();
      // const html = parser.parseFromString(json[sectionId], "text/html");
      // const newCartEl = html.querySelector("cart-root");
      const PAGE_ID = `account\subscription\${params.id}`;
      const sectionId = `main-subscription__${PAGE_ID}`;
      const responseContent = await fetch(`/${PAGE_ID}?sections=${sectionId}`);
      console.log("responseContent", responseContent)

      if (!responseContent.ok) {
        throw new Error("Failed to fetch new content");
      }

      return result;
    } catch (error) {
      console.error("Error during updating subscription:", error);

      throw error;
    }
  }
}
