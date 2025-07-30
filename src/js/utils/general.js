export function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function toNumber(value, defaultValue = 0) {
  const number = Number(value);

  return Number.isNaN(number) ? defaultValue : number;
}
