import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEquityDetails } from '../api/equity';
import type { EquityResponse } from '../schema/equity';
import './DetailsPage.css';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

function DetailsPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<EquityResponse | null>(null);
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('Chart');

  const tabs = [
    'Chart',
    'Analysis',
    'Peers',
    'Quarters',
    'Profit & Loss',
    'Balance Sheet',
    'Cash Flow',
    'Ratios',
    'Investors',
    'Documents',
  ];

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
      try {
        const data = await fetchEquityDetails(currentSymbol, {
          signal: controller.signal,
        });
        setDetails(data);
        setStatus('success');
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          return;
        }
        setError(loadError instanceof Error ? loadError : new Error('Failed to load'));
        setStatus('error');
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [symbol]);

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

  const priceChange = details?.priceInfo?.change ?? null;
  const priceChangeClass = priceChange === null ? '' : priceChange < 0 ? 'is-down' : 'is-up';

  return (
    <div className="DetailsPage">
      <header className="DetailsPage-header">
        <div className="DetailsPage-nav">
          <button onClick={() => navigate('/')} className="DetailsPage-logo">
            <span className="DetailsPage-logo-text">Quant</span>
            <span className="DetailsPage-logo-accent">xis</span>
          </button>

          <nav className="DetailsPage-nav-links">
            <a href="/">HOME</a>
            <a href="/screens">SCREENS</a>
            <a href="/tools">TOOLS</a>
          </nav>
        </div>

        <div className="DetailsPage-actions">
          <div className="DetailsPage-search">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input type="search" placeholder="Search for a company" />
          </div>
          <button className="DetailsPage-btn-outline">LOGIN</button>
          <button className="DetailsPage-btn-primary">GET FREE ACCOUNT</button>
        </div>
      </header>

      {status === 'loading' && (
        <div className="DetailsPage-loading">Loading {symbol}...</div>
      )}

      {status === 'error' && (
        <div className="DetailsPage-error">
          {error?.message || 'Failed to load company details.'}
        </div>
      )}

      {status === 'success' && details && (
        <>
          <div className="DetailsPage-tabs-wrapper">
            <div className="DetailsPage-tabs-container">
              <div className="DetailsPage-symbol">{symbol}</div>
              <div className="DetailsPage-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`DetailsPage-tab ${activeTab === tab ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="DetailsPage-tabs-actions">
                <button className="DetailsPage-notebook-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <line x1="9" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" />
                    <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Notebook
                </button>
                <button className="DetailsPage-ai-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  AI
                </button>
              </div>
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
                      01 Jan 2:10 p.m.
                    </span>
                  </div>
                  <div className="DetailsPage-company-links">
                    <a
                      href={`https://${details.info.companyName.toLowerCase().replace(/\s+/g, '')}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="DetailsPage-link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {details.info.companyName.toLowerCase().replace(/\s+/g, '')}.com
                    </a>
                    <span className="DetailsPage-divider">|</span>
                    <span>BSE: 500410</span>
                    <span className="DetailsPage-divider">|</span>
                    <span>NSE: {symbol}</span>
                  </div>
                </div>

                <div className="DetailsPage-company-actions">
                  <button className="DetailsPage-export-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5m0 0l5 5m-5-5v12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    EXPORT TO EXCEL
                  </button>
                  <button className="DetailsPage-follow-btn">
                    + FOLLOW
                  </button>
                </div>
              </div>

              <div className="DetailsPage-metrics">
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Market Cap</span>
                  <span className="DetailsPage-metric-value">₹ 32,703 Cr.</span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Current Price</span>
                  <span className="DetailsPage-metric-value">
                    ₹ {formatNumber(details.priceInfo.lastPrice)}
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">High / Low</span>
                  <span className="DetailsPage-metric-value">
                    ₹ 2,123 / 1,715
                  </span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Stock P/E</span>
                  <span className="DetailsPage-metric-value">10.2</span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Book Value</span>
                  <span className="DetailsPage-metric-value">₹ 1,061</span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Dividend Yield</span>
                  <span className="DetailsPage-metric-value">0.43 %</span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">ROCE</span>
                  <span className="DetailsPage-metric-value">17.4 %</span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">ROE</span>
                  <span className="DetailsPage-metric-value">13.2 %</span>
                </div>
                <div className="DetailsPage-metric">
                  <span className="DetailsPage-metric-label">Face Value</span>
                  <span className="DetailsPage-metric-value">₹ 10.0</span>
                </div>
              </div>
            </div>

            <aside className="DetailsPage-sidebar">
              <div className="DetailsPage-about">
                <h2 className="DetailsPage-sidebar-title">ABOUT</h2>
                <p className="DetailsPage-about-text">
                  {details.info.companyName} (incorporated in 1936), a member of the Adani Group, is
                  principally engaged in the business of manufacturing and selling of
                  Cement and Ready Mix Concrete. The Company has manufacturing...
                </p>
              </div>

              <div className="DetailsPage-keypoints">
                <h2 className="DetailsPage-sidebar-title">KEY POINTS</h2>
                <div className="DetailsPage-keypoint">
                  <strong>Business Segments</strong>
                  <p>
                    1) Cement (94% in FY24 vs 91% in CY19):{' '}
                    <sup className="DetailsPage-ref">[1]</sup>{' '}
                    <sup className="DetailsPage-ref">[2]</sup> The company offers...
                  </p>
                </div>
                <button className="DetailsPage-read-more">
                  READ MORE <span>›</span>
                </button>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailsPage;
