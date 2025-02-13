// @ts-nocheck

import { computePosition, flip, offset, shift, arrow, autoUpdate } from '@floating-ui/dom';

/**
 * Popover web component that displays a popover with dynamic positioning.
 *
 * @export
 * @class Popover
 * @extends {HTMLElement}
 */
export class Popover extends HTMLElement {
  constructor() {
    super();
    this.root = this.querySelectorAll('popover-root');
    this.trigger = this.querySelectorAll('popover-trigger');
    this.content = this.querySelectorAll('popover-content');
    this.arrowEl = this.querySelectorAll('popover-arrow');
    this.cleanupFns = []; // To store cleanup functions for autoUpdate
    this.hidePopover = () => {}; // Initialize hidePopover to a no-op function
    this.clickOutsideListener = this.handleClickOutside.bind(this);
    this.ids = 0;
    this.init();
  }

  init() {
    this.trigger.forEach((trigger, index) => {
      // Guard clause
      if (!this.root || !this.trigger) return;

      const id = `popover-${this.ids++}`;
      trigger.setAttribute('aria-describedby', id);

      const content = this.content[index];
      const arrowEl = this.arrowEl[index];

      // Guard clause
      if (!content || !arrowEl) return;

      // Set unique id for each popover content
      content.setAttribute('id', id);

      const showPopover = () => {
        document.body.append(content); // Mount the popover
        content.style.display = 'block'; // Show the popover

        // Start auto updates and store the cleanup function
        const cleanup = autoUpdate(trigger, content, () => {
          this.updatePosition(trigger, content, arrowEl);
        });
        this.cleanupFns[index] = cleanup; // Save the cleanup function

        // Add click outside event listener
        document.addEventListener('click', this.clickOutsideListener);
      };

      const hidePopover = () => {
        content.style.display = ''; // Hide the popover
        content.remove(); // Unmount the popover

        // Stop auto updates
        if (this.cleanupFns[index]) {
          this.cleanupFns[index]();
          this.cleanupFns[index] = null; // Clean up the reference
        }

        // Remove click outside event listener
        document.removeEventListener('click', this.clickOutsideListener);
      };

      // Store the hidePopover function for use in handleClickOutside
      this.hidePopover = hidePopover;

      // Attach event listeners for show/hide functionality
      [['click', showPopover]].forEach(([event, listener]) => {
        trigger.addEventListener(event, listener);
      });
    });
  }

  handleClickOutside(event) {
    // Check if the click is outside both the trigger and the popover
    const isClickOutside = ![...this.trigger, ...this.content].some((el) => el.contains(event.target));

    if (isClickOutside && this.hidePopover) {
      this.hidePopover(); // Hide the popover if click outside
    }
  }

  updatePosition(trigger, content, arrowEl) {
    computePosition(trigger, content, {
      placement: 'bottom',
      middleware: [flip(), offset(4), shift({ padding: 48 }), arrow({ element: arrowEl })],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(content.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      const { x: arrowX, y: arrowY } = middlewareData.arrow || {};

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign(arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      });
    });
  }
}
