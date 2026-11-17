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
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('должен выбрасывать HttpError со статусом, если ответ сервера неуспешный (например, 500)', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(searchCountries('Spain')).rejects.toThrow(HttpError);
  });

  test('должен возвращать пустой массив при статусе 404', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const result = await searchCountries('UnknownCountry');
    expect(result).toEqual([]);
  });
});