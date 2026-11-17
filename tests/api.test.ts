import { test, expect } from '@jest/globals';
import { mapCountryResponse } from '../src/utils/api';

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
