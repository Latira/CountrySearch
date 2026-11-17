export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: any;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}