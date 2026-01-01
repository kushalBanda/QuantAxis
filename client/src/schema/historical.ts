export interface HistoricalDataPoint {
  chSymbol: string;
  chSeries: string;
  chPreviousClsPrice: number;
  chOpeningPrice: number;
  chTradeHighPrice: number;
  chTradeLowPrice: number;
  chLastTradedPrice: number;
  chClosingPrice: number;
  vwap: number;
  chTotTradedQty: number;
  chTotTradedVal: number;
  chTotalTrades: number;
  ch52WeekHighPrice: number;
  ch52WeekLowPrice: number;
  mtimestamp: string;
}

export interface HistoricalMetadata {
  series: string[];
  fromDate: string;
  toDate: string;
  symbols: string[];
}

export interface HistoricalResponse {
  data: HistoricalDataPoint[];
  meta: HistoricalMetadata;
}

export type HistoricalApiResponse = HistoricalResponse[];
