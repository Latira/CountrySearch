import { debounce } from './utils/debounce.js';
import { searchCountries, mapCountryResponse } from './utils/api.js';
import { el } from './utils/dom.js';
const title = el('h2', 'Live Country Search');
const searchInput = el('input', '', 'search-input');
const loader = el('div', 'Loading countries...', 'loader');
const errorBox = el('div', '', 'error-box');
const resultsContainer = el('div', '', 'results');
searchInput.placeholder = 'Type country name (e.g., Spain)...';
searchInput.autocomplete = 'off';
searchInput.type = 'text';
document.body.appendChild(title);
document.body.appendChild(searchInput);
searchInput.id = 'search-input';
document.body.appendChild(loader);
document.body.appendChild(errorBox);
document.body.appendChild(resultsContainer);
let currentAbortController = null;
async function performSearch(query) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        resultsContainer.replaceChildren();
        loader.style.display = 'none';
        errorBox.style.display = 'none';
        return;
    }
    try {
        errorBox.style.display = 'none';
        loader.style.display = 'block';
        currentAbortController = new AbortController();
        const rawData = await searchCountries(trimmedQuery, currentAbortController.signal);
        const countries = mapCountryResponse(rawData);
        resultsContainer.replaceChildren();
        loader.style.display = 'none';
        if (countries.length === 0) {
            resultsContainer.appendChild(el('div', 'Friendly 404: Nothing found'));
            return;
        }
        countries.forEach(country => {
            const card = el('div', `${country.flag} ${country.name} (Capital: ${country.capital})`, 'country-card');
            resultsContainer.appendChild(card);
        });
    }
    catch (error) {
        if (error.name === 'AbortError') {
            return;
        }
        loader.style.display = 'none';
        resultsContainer.replaceChildren();
        errorBox.style.display = 'block';
        errorBox.textContent = `Error loaded: ${error.message || 'Unknown network error'}`;
    }
}
const debouncedSearch = debounce((query) => {
    performSearch(query);
}, 300);
searchInput.addEventListener('input', (event) => {
    const target = event.target;
    if (currentAbortController) {
        currentAbortController.abort();
    }
    debouncedSearch(target.value);
});
