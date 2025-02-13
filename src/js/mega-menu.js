// import { uiManager } from "./utils/ui-manager";

// /**
//  *
//  *
//  * @export
//  * @class MegaMenu
//  * @extends {HTMLElement}
//  */
// export class MegaMenu extends HTMLElement {
//   constructor() {
//     super();
//     this.megaMenu = document.querySelectorAll("mega-menu");
//     this.trigger = document.querySelectorAll("mega-menu-trigger");
//     this.init();
//   }

//   init() {
//     this.trigger.forEach((menu, index) => {
//       if (!this.megaMenu || !this.trigger) return;

//       // Mouse enter mega menu trigger
//       menu.addEventListener("mouseenter", () => {
//         this.megaMenu[index].classList.remove("hidden");
//       });

//       // Mouse leave mega menu trigger
//       menu.addEventListener("mouseleave", () => {
//         this.megaMenu[index].classList.add("hidden");
//       });

//       // Mouse enter mega menu
//       this.megaMenu[index].addEventListener("mouseenter", () => {
//         this.megaMenu[index].classList.remove("hidden");
//       });

//       // Mouse leave mega menu
//       this.megaMenu[index].addEventListener("mouseleave", () => {
//         this.megaMenu[index].classList.add("hidden");
//       });
//     });
//   }

//   open() {}

//   close() {}
// }
