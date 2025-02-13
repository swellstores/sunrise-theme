/**
 * @function updateUrlParams
 * @description This function sets the URL parameters based on the provided object.
 */
function updateUrlParams(params, mode = "push") {
  // Get the current URL and create a URL object
  const url = new URL(window.location);

  // Iterate over the params object
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];

      if (value === null) {
        // If value is null, delete the parameter
        url.searchParams.delete(key);
      } else if (typeof value === "object" && value !== null) {
        // Handle one level deep nested fields
        for (const nestedKey in value) {
          if (value.hasOwnProperty(nestedKey)) {
            const nestedValue = value[nestedKey];
            const fullKey = `${key}[${nestedKey}]`;

            if (nestedValue === null) {
              url.searchParams.delete(fullKey);
            } else {
              url.searchParams.set(fullKey, nestedValue);
            }
          }
        }
      } else {
        // Otherwise, set the parameter
        url.searchParams.set(key, value);
      }
    }
  }

  // Update the URL with history push or replace
  if (mode === "replace") {
    history.replaceState(null, "", url);
  } else {
    history.pushState(null, "", url);
  }
}
