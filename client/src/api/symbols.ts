import { apiGet } from './client';
import type { SymbolsResponse } from '../schema/symbols';

function fetchAllSymbols(options?: { signal?: AbortSignal }) {
  return apiGet<SymbolsResponse>('/api/allSymbols', options);
}

export { fetchAllSymbols };
