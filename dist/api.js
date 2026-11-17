export function mapCountryResponse(raw) {
    if (!Array.isArray(raw))
        return [];
    return raw.map((item) => ({
        name: item.name?.common || item.name || 'Unknown',
        flag: item.flag || item.flags?.png || '',
        capital: Array.isArray(item.capital) ? item.capital[0] : (item.capital || 'N/A'),
        region: item.region || 'N/A',
        population: item.population || 0,
    }));
}
export class HttpError extends Error {
    status;
    constructor(status) {
        super(`HTTP Error: ${status}`);
        this.status = status;
        this.name = 'HttpError';
    }
}
export async function searchCountries(query, signal) {
    if (!query.trim())
        return [];
    const response = await fetch(`https://countries.dev{encodeURIComponent(query)}`, { signal });
    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new HttpError(response.status);
    }
    return await response.json();
}
