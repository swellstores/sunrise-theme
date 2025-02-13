/**
 *
 *
 * @export
 * @class CopyToClipboard
 * @extends {HTMLElement}
 */
export class CopyToClipboard extends HTMLElement {
  constructor() {
    super();
    this.triggers = document.querySelectorAll('copy-to-clipboard');
    this.init();
  }

  init() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', (_event) => {
        const contentToCopy = trigger.getAttribute('data-copy-content');
        if (contentToCopy) {
          navigator.clipboard
            .writeText(contentToCopy)
            .then(() => {
              console.log('Content copied to clipboard:', contentToCopy);
              // TODO: Add message
            })
            .catch((err) => {
              console.error('Failed to copy content:', err);
            });
        }
      });
    });
  }
}
