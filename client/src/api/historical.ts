import { apiGet } from './client';
import type { HistoricalApiResponse } from '../schema/historical';

interface FetchHistoricalDataOptions {
  signal?: AbortSignal;
}

export async function fetchHistoricalData(
  symbol: string,
  dateStart: string,
  dateEnd: string,
  options: FetchHistoricalDataOptions = {},
): Promise<HistoricalApiResponse> {
  const path = `/api/equity/historical/${symbol}?dateStart=${dateStart}&dateEnd=${dateEnd}`;
  console.log('Fetching historical data:', { symbol, dateStart, dateEnd });
  const response = await apiGet<HistoricalApiResponse>(path, options);
  console.log('Historical data response:', response);
  return response;
}
