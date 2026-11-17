import { jest, test, expect } from '@jest/globals';
import { debounce } from '../src/utils/debounce';

jest.useFakeTimers();

test('debounce задерживает вызов функции', () => {
  const callback = jest.fn();
  const debounced = debounce(callback, 300);

  debounced();
  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(300);
  expect(callback).toHaveBeenCalledTimes(1);
});
