export interface Country {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
}

export function mapCountryResponse(raw: any): Country[] {
  if (!Array.isArray(raw)) return [];
  
  return raw.map((item: any) => ({
    name: item.name?.common || item.name || 'Unknown',
    flag: item.flag || item.flags?.png || '',
    capital: Array.isArray(item.capital) ? item.capital[0] : (item.capital || 'N/A'),
    region: item.region || 'N/A',
    population: item.population || 0,
  }));
}

export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP Error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(query: string, signal?: AbortSignal): Promise<any[]> {
  if (!query.trim()) return [];

  const response = await fetch(`https://countries.dev/name/${encodeURIComponent(query)}`, { signal });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new HttpError(response.status);
  }

  return await response.json();
}