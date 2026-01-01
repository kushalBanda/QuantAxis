import { apiGet } from './client';
import type { EquityResponse } from '../schema/equity';

function fetchEquityDetails(symbol: string, options?: { signal?: AbortSignal }) {
  const encodedSymbol = encodeURIComponent(symbol);
  return apiGet<EquityResponse>(`/api/equity/${encodedSymbol}`, options);
}

export { fetchEquityDetails };
