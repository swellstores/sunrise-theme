import htmx from "./htmx.min.js";

// Make htmx available globally
if (typeof window !== "undefined") {
  window.htmx = htmx;
}

export function loadIonIcons() {
  if (!document.querySelector('script[src*="ionicons"]')) {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://cdn.jsdelivr.net/npm/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
    script.async = true;
    document.body.appendChild(script);
  }
}
