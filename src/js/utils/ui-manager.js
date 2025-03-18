/**
 * @module UIManager
 * @description The UIManager is responsible for managing the visibility and active state of UI components.
 * It ensures that only one UI component (e.g., a modal, drawer, or overlay) is active and visible at a time.
 * When a new component is opened, the UIManager automatically closes any previously active component.
 */
export const uiManager = {
  activeComponent: null,

  open(component) {
    if (this.activeComponent && this.activeComponent !== component) {
      this.activeComponent.close();
    }
    this.activeComponent = component;
    component.open();
  },

  close(component) {
    if (this.activeComponent === component) {
      component.close();
      this.activeComponent = null;
    }
  },
};
