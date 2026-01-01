export interface EquityInfo {
  symbol: string;
  companyName: string;
  industry: string;
  activeSeries: string[];
  debtSeries: string[];
  isFNOSec: boolean;
  isCASec: boolean;
  isSLBSec: boolean;
  isDebtSec: boolean;
  isSuspended: boolean;
  tempSuspendedSeries: string[];
  isETFSec: boolean;
  isDelisted: boolean;
  isin: string;
  slb_isin: string;
  listingDate: string;
  isMunicipalBond: boolean;
  isHybridSymbol: boolean;
  segment: string;
  isTop10: boolean;
  identifier: string;
}

export interface EquityMetadata {
  series: string;
  symbol: string;
  isin: string;
  status: string;
  listingDate: string;
  industry: string;
  lastUpdateTime: string;
  pdSectorPe: number;
  pdSymbolPe: number;
  pdSectorInd: string;
  pdSectorIndAll: string[];
}

export interface EquitySecurityInfo {
  boardStatus: string;
  tradingStatus: string;
  tradingSegment: string;
  sessionNo: string;
  slb: string;
  classOfShare: string;
  derivatives: string;
  surveillance: {
    surv: string | null;
    desc: string | null;
  };
  faceValue: number;
  issuedSize: number;
}

export interface EquitySddDetails {
  SDDAuditor: string;
  SDDStatus: string;
}

export interface EquityPriceInfo {
  lastPrice: number;
  change: number;
  pChange: number;
  previousClose: number;
  open: number;
  close: number;
  vwap: number;
  stockIndClosePrice: number;
  lowerCP: string;
  upperCP: string;
  pPriceBand: string;
  basePrice: number;
  intraDayHighLow: {
    min: number;
    max: number;
    value: number;
  };
  weekHighLow: {
    min: number;
    minDate: string;
    max: number;
    maxDate: string;
    value: number;
  };
  iNavValue: number | null;
  checkINAV: boolean;
  tickSize: number;
  ieq: string;
}

export interface EquityIndustryInfo {
  macro: string;
  sector: string;
  industry: string;
  basicIndustry: string;
}

export interface EquityPreOpenEntry {
  price: number;
  buyQty: number;
  sellQty: number;
  iep?: boolean;
}

export interface EquityPreOpenMarket {
  preopen: EquityPreOpenEntry[];
  ato: {
    buy: number;
    sell: number;
  };
  IEP: number;
  totalTradedVolume: number;
  finalPrice: number;
  finalQuantity: number;
  lastUpdateTime: string;
  totalBuyQuantity: number;
  totalSellQuantity: number;
  atoBuyQty: number;
  atoSellQty: number;
  Change: number;
  perChange: number;
  prevClose: number;
}

export interface EquityResponse {
  info: EquityInfo;
  metadata: EquityMetadata;
  securityInfo: EquitySecurityInfo;
  sddDetails: EquitySddDetails;
  currentMarketType: string;
  priceInfo: EquityPriceInfo;
  industryInfo: EquityIndustryInfo;
  preOpenMarket: EquityPreOpenMarket;
}
