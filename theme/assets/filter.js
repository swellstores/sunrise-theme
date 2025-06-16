function filters() {
  window.updateSortFilters = updateSortFilters;

  showHideFilterDrawer();
  showHideFilterMenus();
}

function onClickFilterDrawer() {
  const target = document.querySelector('[data-target="filter-drawer"]');
  const isExpanded = target.getAttribute("aria-expanded") === "true";

  target.setAttribute("aria-expanded", !isExpanded);
  target.classList.toggle("hidden");
}

function showHideFilterDrawer() {
  const triggers = document.querySelectorAll('[data-trigger="filter-drawer"]');

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", onClickFilterDrawer);
  });
}

function getFilterMenuTriggers() {
  return document.querySelectorAll('[data-trigger="filter-menu"]');
}

function onClickFilterMenu(event) {
  const triggers = getFilterMenuTriggers();
  const trigger = event.currentTarget;
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
}

function showHideFilterMenus() {
  const triggers = getFilterMenuTriggers();

  if (!triggers.length) {
    return null;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", onClickFilterMenu);
  });
}

// Handle sort/filter change
function updateSortFilters(event) {
  const filterFormBar = document.querySelector("#filter-form-bar");
  const filterFormStack = document.querySelector("#filter-form-stack");
  const sortForm = document.querySelector("#sort-form");

  const searchParams = [];
  let requestParams = {};

  const filterForm =
    event.target.id === "filter-form-stack" ? filterFormStack : filterFormBar;

  [filterForm, sortForm].forEach((form) => {
    if (!form) return;
    const formData = new FormData(form);

    // Convert form data to query string for updating URL
    const formQuery = formDataToQueryString(form, formData, searchParams);

    if (formQuery) {
      searchParams.push(formQuery);
    }

    // Convert form data to object for setting HTMX request parameters
    requestParams = {
      ...requestParams,
      ...formDataToObject(form, formData),
    };
  });

  // Update the URL search parameters
  const url = new URL(window.location);
  url.search = searchParams.join("&");
  window.history.replaceState({}, "", url);

  // Update the HTMX request parameters
  event.detail.parameters = requestParams;
}

function shouldApplyFilterValue(form, key, value) {
  const field = form.querySelector(`[name="${key}"]`);

  if (!field) {
    return false;
  }

  if (field.type === "range" && [field.max, field.min].includes(value)) {
    return false;
  }

  return true;
}

// Convert FormData object to URLSearchParams string with falsy values removed
function formDataToQueryString(form, formData, searchParams) {
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    if (!shouldApplyFilterValue(form, key, value)) {
      return;
    }

    // Only include key-value pairs with truthy values, and not already included in searchParams
    if (value && !searchParams.includes(`${key}=${value}`)) {
      params.append(key, value);
    }
  });

  return params.toString();
}

// Convert FormData to regular object with duplicates combined into arrays and falsy values removed
function formDataToObject(form, formData) {
  let params = {};

  formData.forEach((value, key) => {
    // Only include key-value pairs with truthy values
    if (!value || !shouldApplyFilterValue(form, key, value)) {
      return;
    }

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
  });

  return params;
}

filters();
