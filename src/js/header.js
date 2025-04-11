class HeaderManager {
  constructor() {
    this.mobileTray = document.getElementById("mobileTray");
    this.mainMenu = document.getElementById("mainMenu");
    this.submenuTray = document.getElementById("submenuTray");
    this.trayTitle = document.getElementById("trayTitle");
    this.sublinkTrayContent = document.getElementById("sublinkTrayContent");

    this.init();
  }

  init() {
    const toggleButton = document.querySelector(
      'button[data-mobile-trigger]'
    );
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggleMobileTray());
    }

    window.openSubMenu = (submenuId, title) =>
      this.openSubMenu(submenuId, title);
    window.closeSubLinkTray = () => this.closeSubLinkTray();
  }

  toggleMobileTray() {
    if (this.mobileTray) {
      this.mobileTray.classList.toggle("hidden");
      const isTrayOpen = !this.mobileTray.classList.contains("hidden");

      const toggleButton = document.querySelector(
        'button[onclick="toggleMobileTray()"]'
      );
      if (toggleButton) {
        toggleButton.innerHTML = isTrayOpen
          ? `
            <!-- Cross Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          `
          : `
            <!-- Hamburger Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          `;
      }
    }
  }

  openSubMenu(submenuId, title) {
    const sublinks = document.querySelector(`#${submenuId}`);

    if (sublinks) {
      this.sublinkTrayContent.innerHTML = "";
      this.renderSublinks(sublinks, this.sublinkTrayContent);

      this.trayTitle.textContent = title;

      this.mainMenu.classList.add("hidden");
      this.submenuTray.classList.remove("hidden");
    } else {
      console.error(`No sublinks found for submenuId: ${submenuId}`);
    }
  }

  closeSubLinkTray() {
    // Show main menu and hide submenu tray
    this.mainMenu.classList.remove("hidden");
    this.submenuTray.classList.add("hidden");
  }

  renderSublinks(sublinks, container) {
    sublinks.querySelectorAll(":scope > li").forEach((item) => {
      const link = item.querySelector("a") || item.querySelector("button");
      const nestedMenu = item.querySelector(":scope > ul");
      const listItem = document.createElement("li");
      listItem.classList.add(
        "h-[48px]",
        "flex",
        "items-center",
        "justify-between",
        "cursor-pointer"
      );

      if (link) {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(
          "flex",
          "items-center",
          "justify-between",
          "w-full"
        );

        const button = document.createElement("button");
        button.textContent = link.textContent.trim() || "Unnamed";
        button.classList.add("submenu-button", "flex-grow", "text-left");

        if (nestedMenu) {
          const submenuId = nestedMenu.id;
          listItem.setAttribute("data-submenu-id", submenuId);
          listItem.addEventListener("click", () =>
            this.openSubMenu(
              submenuId,
              link.textContent.trim() || "Unnamed Submenu"
            )
          );
        } else if (link.tagName.toLowerCase() === "a") {
          listItem.addEventListener("click", () => {
            window.location.href = link.href;
          });
        }

        buttonContainer.appendChild(button);

        if (link.tagName === 'BUTTON') {
          const arrowSpan = document.createElement("span");
          arrowSpan.classList.add("flex-shrink-0", "ml-2");
          arrowSpan.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20L20 12L12 4" stroke="currentColor" stroke-width="2"></path>
              <path d="M3 11H19V13H3V11Z" fill="currentColor"></path>
            </svg>`;
          buttonContainer.appendChild(arrowSpan);
        }

        listItem.appendChild(buttonContainer);
      } else {
        console.warn("No link or button found for item:", item);
      }

      container.appendChild(listItem);
    });
  }
}

// Create and export an instance of the Header manager
const headerManager = new HeaderManager();
export { headerManager };

export class Header extends HTMLElement {
  connectedCallback() {
    if (window.headerManager) {
      window.headerManager.init();
    }
  }
}