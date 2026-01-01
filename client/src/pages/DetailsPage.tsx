import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEquityDetails } from '../api/equity';
import { fetchHistoricalData } from '../api/historical';
import type { EquityResponse } from '../schema/equity';
import type { HistoricalDataPoint } from '../schema/historical';
import StockChart, { TimePeriod } from '../components/StockChart';
import './DetailsPage.css';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

function DetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<EquityResponse | null>(null);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const calculateDateRange = (period: TimePeriod): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case '1D':
        start.setDate(end.getDate() - 1);
        break;
      case '1W':
        start.setDate(end.getDate() - 7);
        break;
      case '1M':
        start.setMonth(end.getMonth() - 1);
        break;
      case '3M':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6M':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1Y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case '5Y':
        start.setFullYear(end.getFullYear() - 5);
        break;
    }

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  };

  useEffect(() => {
    if (!symbol) {
      setStatus('error');
      setError(new Error('No symbol provided'));
      return;
    }

    const currentSymbol = symbol;
    const controller = new AbortController();

    async function loadDetails() {
      setStatus('loading');
      setError(null);
      setDetails(null);
      console.log('Fetching details for symbol:', currentSymbol);
      try {
        const data = await fetchEquityDetails(currentSymbol, {
          signal: controller.signal,
        });
        console.log('Successfully fetched data:', data);
        setDetails(data);
        setStatus('success');
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        console.error('Error fetching details:', loadError);
        const errorMessage = loadError instanceof Error ? loadError.message : 'Failed to load company details';
        setError(new Error(errorMessage));
        setStatus('error');
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [symbol]);

  useEffect(() => {
    if (!symbol) return;

    const currentSymbol = symbol;
    const controller = new AbortController();

    async function loadHistoricalData() {
      setIsLoadingChart(true);
      console.log('Fetching historical data for period:', selectedPeriod);
      try {
        const { start, end } = calculateDateRange(selectedPeriod);
        const response = await fetchHistoricalData(currentSymbol, start, end, {
          signal: controller.signal,
        });
        console.log('Historical data response:', response);

        if (response && response.length > 0 && response[0].data) {
          setHistoricalData(response[0].data);
        } else {
          setHistoricalData([]);
        }
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          console.log('Historical data request aborted');
          return;
        }
        console.error('Error fetching historical data:', loadError);
        setHistoricalData([]);
      } finally {
        setIsLoadingChart(false);
      }
    }

    loadHistoricalData();

    return () => controller.abort();
  }, [symbol, selectedPeriod]);

  const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) {
      return '-';
    }
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
  };

  const formatPercent = (value?: number | null) => {
    if (value === null || value === undefined) {
      return '-';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatCrores = (value: number) => {
    const crores = value / 10000000;
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(crores);
  };

  const calculateMarketCap = () => {
    if (!details?.securityInfo?.issuedSize || !details?.priceInfo?.lastPrice) {
      return null;
    }
    return details.securityInfo.issuedSize * details.priceInfo.lastPrice;
  };

  const priceChange = details?.priceInfo?.change ?? null;
  const priceChangeClass = priceChange === null ? '' : priceChange < 0 ? 'is-down' : 'is-up';
  const marketCap = calculateMarketCap();

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/symbol/${searchQuery.trim().toUpperCase()}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="DetailsPage">
      <header className="DetailsPage-header">
        <div className="DetailsPage-nav">
          <button onClick={() => navigate('/')} className="DetailsPage-logo">
            <span className="DetailsPage-logo-text">Quant</span>
            <span className="DetailsPage-logo-accent">xis</span>
          </button>
        </div>

        <div className="DetailsPage-actions">
          <form onSubmit={handleHeaderSearch} className="DetailsPage-search">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for a company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </form>
        </div>
      </header>

      {status === 'loading' && (
        <div className="DetailsPage-loading">Loading {symbol}...</div>
      )}

      {status === 'error' && (
        <div className="DetailsPage-error">
          <h2>Error Loading {symbol}</h2>
          <p>{error?.message || 'Failed to load company details.'}</p>
          <p>Please check the browser console for more details.</p>
          <button onClick={() => navigate('/')} className="DetailsPage-back-btn">
            ← Back to Home
          </button>
        </div>
      )}

      {status === 'success' && details && (
        <>
          <div className="DetailsPage-tabs-wrapper">
            <div className="DetailsPage-tabs-container">
              <div className="DetailsPage-symbol">{symbol}</div>
            </div>
          </div>

          <div className="DetailsPage-content">
            <div className="DetailsPage-main">
              <div className="DetailsPage-company">
                <div>
                  <h1 className="DetailsPage-company-name">{details.info.companyName}</h1>
                  <div className="DetailsPage-company-meta">
                    <div className="DetailsPage-price">
                      <span className="DetailsPage-price-value">
                        ₹ {formatNumber(details.priceInfo.lastPrice)}
                      </span>
                      <span className={`DetailsPage-price-change ${priceChangeClass}`}>
                        {formatPercent(details.priceInfo.pChange)}
                      </span>
                    </div>
                    <span className="DetailsPage-company-date">
                      {details.metadata.lastUpdateTime}
                    </span>
                  </div>
                  <div className="DetailsPage-company-links">
                    <span>NSE: {symbol}</span>
                    <span className="DetailsPage-divider">|</span>
                    <span>ISIN: {details.info.isin}</span>
                    <span className="DetailsPage-divider">|</span>
                    <span>Series: {details.metadata.series}</span>
                    <span className="DetailsPage-divider">|</span>
                    <span>Status: {details.metadata.status}</span>
                  </div>
                </div>
              </div>

              <div className="DetailsPage-metrics">
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Market Cap</span>
                  <span className="DetailsPage-metric-value">
                    {marketCap ? `₹ ${formatCrores(marketCap)} Cr.` : '-'}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Current Price</span>
                  <span className="DetailsPage-metric-value">
                    ₹ {formatNumber(details.priceInfo.lastPrice)}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">High / Low (Day)</span>
                  <span className="DetailsPage-metric-value">
                    {details.priceInfo.intraDayHighLow
                      ? `₹ ${formatNumber(details.priceInfo.intraDayHighLow.max)} / ${formatNumber(details.priceInfo.intraDayHighLow.min)}`
                      : '-'}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">52 Week High / Low</span>
                  <span className="DetailsPage-metric-value">
                    {details.priceInfo.weekHighLow
                      ? `₹ ${formatNumber(details.priceInfo.weekHighLow.max)} / ${formatNumber(details.priceInfo.weekHighLow.min)}`
                      : '-'}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Stock P/E</span>
                  <span className="DetailsPage-metric-value">
                    {formatNumber(details.metadata.pdSymbolPe)}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Sector P/E</span>
                  <span className="DetailsPage-metric-value">
                    {formatNumber(details.metadata.pdSectorPe)}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Face Value</span>
                  <span className="DetailsPage-metric-value">
                    ₹ {formatNumber(details.securityInfo.faceValue)}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">VWAP</span>
                  <span className="DetailsPage-metric-value">
                    ₹ {formatNumber(details.priceInfo.vwap)}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Industry</span>
                  <span className="DetailsPage-metric-value">
                    {details.industryInfo.basicIndustry || details.info.industry}
                  </span>
                </div>
              </div>

              <StockChart
                data={historicalData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                isLoading={isLoadingChart}
              />
            </div>

            <aside className="DetailsPage-sidebar">
              <div className="DetailsPage-about">
                <h2 className="DetailsPage-sidebar-title">ABOUT</h2>
                <p className="DetailsPage-about-text">
                  {details.info.companyName} is listed on the NSE with symbol {details.info.symbol}.
                  The company operates in the {details.industryInfo.basicIndustry} sector,
                  which is part of the broader {details.industryInfo.sector} industry under
                  the {details.industryInfo.macro} category.
                </p>
                <p className="DetailsPage-about-text" style={{ marginTop: '16px' }}>
                  Listed since {details.metadata.listingDate}, the company's securities are
                  actively traded in the {details.securityInfo.tradingSegment} with{' '}
                  {details.securityInfo.derivatives === 'Yes' ? 'derivatives trading available' : 'no derivatives'}.
                  The stock is classified as {details.securityInfo.classOfShare} with
                  a face value of ₹{details.securityInfo.faceValue}.
                </p>
              </div>

              <div className="DetailsPage-keypoints">
                <h2 className="DetailsPage-sidebar-title">KEY METRICS</h2>
                <div className="DetailsPage-keypoint">
                  <strong>Trading Status</strong>
                  <p>
                    Board Status: {details.securityInfo.boardStatus}<br />
                    Trading: {details.securityInfo.tradingStatus}<br />
                    SLB Available: {details.securityInfo.slb}
                  </p>
                </div>
                <div className="DetailsPage-keypoint">
                  <strong>Pre-Market Summary</strong>
                  <p>
                    IEP: ₹{formatNumber(details.preOpenMarket.IEP)}<br />
                    Total Traded Volume: {formatNumber(details.preOpenMarket.totalTradedVolume)}<br />
                    Buy Qty: {formatNumber(details.preOpenMarket.totalBuyQuantity)} |
                    Sell Qty: {formatNumber(details.preOpenMarket.totalSellQuantity)}
                  </p>
                </div>
                <div className="DetailsPage-keypoint">
                  <strong>Index Membership</strong>
                  <p>
                    Primary: {details.metadata.pdSectorInd}<br />
                    {details.metadata.pdSectorIndAll.slice(0, 5).join(', ')}
                    {details.metadata.pdSectorIndAll.length > 5 && ` and ${details.metadata.pdSectorIndAll.length - 5} more`}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailsPage;
