import { test, expect, jest, describe, beforeEach } from '@jest/globals';
import { mapCountryResponse, searchCountries, HttpError } from '../src/utils/api';

test('mapCountryResponse правильно переводит сырые данные', () => {
  const fakeRawResponse = [
    {
      name: { common: 'Spain' },
      flag: '🇪🇸',
      capital: ['Madrid'],
      region: 'Europe',
      population: 47000000
    }
  ];

  const result = mapCountryResponse(fakeRawResponse);

  expect(result).toEqual([
    {
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      population: 47000000
    }
  ]);
});

describe('searchCountries', () => {
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  test('должен выбрасывать HttpError со статусом, если ответ сервера неуспешный (например, 500)', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(searchCountries('Spain')).rejects.toThrow(HttpError);
  });

  test('должен возвращать пустой массив при статусе 404', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const result = await searchCountries('UnknownCountry');
    expect(result).toEqual([]);
  });

  test('должен корректно пробрасывать AbortError при отмене запроса извне', async () => {
    const controller = new AbortController();
    
    fetchSpy.mockImplementation(() => {
      return Promise.reject(new DOMException('The user aborted a request.', 'AbortError'));
    });

    controller.abort();
    await expect(searchCountries('Spain', controller.signal)).rejects.toThrow(
      expect.objectContaining({ name: 'AbortError' })
    );
  });

  test('должен выбрасывать TimeoutError, если сервер отвечает слишком долго', async () => {
    fetchSpy.mockImplementation(() => new Promise(() => {}));

    await expect(searchCountries('TimeoutCountry')).rejects.toThrow(
      expect.objectContaining({ name: 'TimeoutError' })
    );
  }, 10000);
});