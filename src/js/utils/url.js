function isValidSearchValue(value) {
  return value !== "";
}

function getUrlSearchParams(serializedData) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(serializedData)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else if (isValidSearchValue(value)) {
      params.set(key, value);
    }
  }

  return params;
}

export function updateUrlParams(serializedData) {
  const params = getUrlSearchParams(serializedData);
  const url =
    params.size > 0
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;

  history.replaceState(null, "", url);
}
