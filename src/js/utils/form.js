function isValidFormValue(value) {
  return value !== null && value !== undefined;
}

export function serializeFormData(data, prefix = "") {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (!isValidFormValue(value)) {
      return acc;
    }

    const prefixedKey = prefix ? `${prefix}[${key}]` : key;

    if (value instanceof Set) {
      acc[prefixedKey] = Array.from(value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isValidFormValue(item)) {
          const serializedData = serializeFormData(
            item,
            `${prefixedKey}[${index}]`
          );

          Object.assign(acc, serializedData);
        }
      });
    } else if (typeof value === "object") {
      const serializedData = serializeFormData(value, prefixedKey);

      Object.assign(acc, serializedData);
    } else {
      acc[prefixedKey] = String(value);
    }

    return acc;
  }, {});
}

export function applySerializedData(event, serializedData) {
  Object.entries(serializedData).forEach(([key, value]) => {
    event.detail.parameters[key] = value;
  });
}

export function setFormParams(event, data) {
  const serializedData = serializeFormData(data);

  applySerializedData(event, serializedData);
}

export function getFormData(form) {
  if (!form) {
    return null;
  }

  const formData = new FormData(form);

  return Object.fromEntries(formData.entries());
}

export function isFormChanged(form, initialData) {
  if (!form || !initialData) {
    return false;
  }

  const currentData = getFormData(form);
  const currentDataKeys = Object.keys(currentData);

  if (currentDataKeys.length !== Object.keys(initialData).length) {
    return true;
  }

  return currentDataKeys.some((key) => currentData[key] !== initialData[key]);
}

export function isFormValid(form) {
  if (!form) {
    return false;
  }

  for (const element of form.elements) {
    if (!("validity" in element)) {
      continue;
    }

    if (!element.validity.valid) {
      return false;
    }
  }

  return true;
}
