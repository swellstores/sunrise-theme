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
