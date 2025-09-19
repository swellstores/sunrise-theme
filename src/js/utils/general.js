export function toNumber(value, defaultValue = 0, precision = 0) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return defaultValue;
  }

  const factor = 10 ** precision;

  return Math.round(number * factor) / factor;
}
