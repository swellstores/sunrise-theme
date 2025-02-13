function filters() {
  window.updateSortFilters = updateSortFilters;

  showHideFilterDrawer();
  showHideFilterMenus();
  toggleMenu();
}

function showHideFilterDrawer() {
  const triggers = document.querySelectorAll('[data-trigger="filter-drawer"]');
  const target = document.querySelector('[data-target="filter-drawer"]');

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function (event) {
      const isExpanded = target.getAttribute("aria-expanded") === "true";
      target.setAttribute("aria-expanded", !isExpanded);
      target.classList.toggle("hidden");
    });
  });
}

function showHideFilterMenus() {
  const triggers = document.querySelectorAll('[data-trigger="filter-menu"]');

  if (!triggers.length) {
    return null;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function (event) {
      const targetMenu = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      // When trigger is clicked, close all other menus
      triggers.forEach((t) => {
        if (t !== trigger) {
          t.setAttribute("aria-expanded", false);
          t.nextElementSibling.classList.add("hidden");
        }
      });

      // Toggle the target menu visibility
      // Toggle the aria-expanded attribute on the trigger
      trigger.setAttribute("aria-expanded", !isExpanded);
      // Toggle the visibility of the target
      targetMenu.classList.toggle("hidden");
    });
  });
}

function toggleMenu() {
  const menus = document.querySelectorAll('[data-target="filter-menu"]');

  // Toggle the aria-expanded attribute
  target.setAttribute("aria-expanded", !isExpanded);
  // Toggle the visibility of the target
  target.classList.toggle("hidden");
}

// Handle sort/filter change
function updateSortFilters(event) {
  const filterFormBar = document.querySelector("#filter-form-bar");
  const filterFormStack = document.querySelector("#filter-form-stack");
  const sortForm = document.querySelector("#sort-form");

  const searchParams = [];
  let requestParams = {};

  const filterForm =
    event.target.id === "filter-form-bar" ? filterFormBar : filterFormStack;

  [filterForm, sortForm].forEach((form) => {
    const formData = new FormData(form);

    // Convert form data to query string for updating URL
    const formQuery = formDataToQueryString(formData, searchParams);

    if (formQuery) {
      searchParams.push(formQuery);
    }

    // Convert form data to object for setting HTMX request parameters
    requestParams = {
      ...requestParams,
      ...formDataToObject(formData),
    };
  });

  // Update the URL search parameters
  const url = new URL(window.location);
  url.search = searchParams.join("&");
  window.history.replaceState({}, "", url);

  // Update the HTMX request parameters
  event.detail.parameters = requestParams;
}

// Convert FormData object to URLSearchParams string with falsy values removed
function formDataToQueryString(formData, searchParams) {
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    // Only include key-value pairs with truthy values, and not already included in searchParams
    if (value && !searchParams.includes(`${key}=${value}`)) {
      params.append(key, value);
    }
  });

  return params.toString();
}

// Convert FormData to regular object with duplicates combined into arrays and falsy values removed
function formDataToObject(formData) {
  let params = {};

  formData.forEach((value, key) => {
    // Only include key-value pairs with truthy values
    if (value) {
      // If the key already exists in the params object
      if (params.hasOwnProperty(key)) {
        // If the existing entry is not already an array, convert it to an array
        if (!Array.isArray(params[key])) {
          params[key] = [params[key]];
        }
        // Push the new value to the array
        params[key].push(value);
      } else {
        // If the key does not exist, add it to the params object
        params[key] = value;
      }
    }
  });

  return params;
}
