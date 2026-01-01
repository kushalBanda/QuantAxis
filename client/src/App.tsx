import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchEquityDetails } from './api/equity';
import { fetchAllSymbols } from './api/symbols';
import type { EquityResponse } from './schema/equity';
import type { SymbolsResponse } from './schema/symbols';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [symbols, setSymbols] = useState<SymbolsResponse>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [detailsStatus, setDetailsStatus] = useState<LoadStatus>('idle');
  const [detailsError, setDetailsError] = useState<Error | null>(null);
  const [details, setDetails] = useState<EquityResponse | null>(null);
  const itemsPerPage = 48;
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSymbols() {
      setStatus('loading');
      setError(null);
      try {
        const data = await fetchAllSymbols({ signal: controller.signal });
        setSymbols(Array.isArray(data) ? data : []);
        setStatus('success');
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          return;
        }
        setError(loadError instanceof Error ? loadError : new Error('Failed to load'));
        setStatus('error');
      }
    }

    loadSymbols();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!panelRef.current || panelRef.current.contains(event.target as Node)) {
        return;
      }
      setHasInteracted(false);
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (!selectedSymbol) {
      return;
    }

    const symbol = selectedSymbol;
    const controller = new AbortController();

    async function loadDetails() {
      setDetailsStatus('loading');
      setDetailsError(null);
      setDetails(null);
      try {
        const data = await fetchEquityDetails(symbol, {
          signal: controller.signal,
        });
        setDetails(data);
        setDetailsStatus('success');
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === 'AbortError') {
          return;
        }
        setDetailsError(loadError instanceof Error ? loadError : new Error('Failed to load'));
        setDetailsStatus('error');
      }
    }

    loadDetails();

    return () => controller.abort();
  }, [selectedSymbol]);

  const filteredSymbols = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return symbols;
    }
    return symbols.filter((symbol) =>
      symbol.toLowerCase().includes(normalizedQuery),
    );
  }, [symbols, query]);

  useEffect(() => {
    if (!hasInteracted) {
      return;
    }
    if (query.trim().length === 0) {
      return;
    }
    if (filteredSymbols.length === 1 && filteredSymbols[0] !== selectedSymbol) {
      setSelectedSymbol(filteredSymbols[0]);
    }
  }, [filteredSymbols, hasInteracted, query, selectedSymbol]);

  const totalPages = Math.max(1, Math.ceil(filteredSymbols.length / itemsPerPage));
  const clampedPage = Math.min(currentPage, totalPages);
  const pagedSymbols = useMemo(() => {
    const start = (clampedPage - 1) * itemsPerPage;
    return filteredSymbols.slice(start, start + itemsPerPage);
  }, [filteredSymbols, clampedPage]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }),
    [],
  );

  const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) {
      return '-';
    }
    return numberFormatter.format(value);
  };

  const formatPercent = (value?: number | null) => {
    if (value === null || value === undefined) {
      return '-';
    }
    return `${value.toFixed(2)}%`;
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setHasInteracted(true);
  };

  const priceChange = details?.priceInfo?.change ?? null;
  const priceChangeClass =
    priceChange === null ? '' : priceChange < 0 ? 'is-down' : 'is-up';

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p className="App-eyebrow">QuantAxis</p>
          <h1>Symbols Directory</h1>
          <p className="App-subtitle">
            Live list powered by your local API.
          </p>
        </div>
        <div className="App-status">
          {status === 'loading' && <span>Loading…</span>}
          {status === 'error' && (
            <span className="App-error">
              {error?.message || 'Failed to load symbols'}
            </span>
          )}
          {status === 'success' && (
            <span>{filteredSymbols.length} symbols</span>
          )}
        </div>
      </header>

      <section className="App-panel" ref={panelRef}>
        <label className="App-search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Type to filter symbols"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHasInteracted(true);
            }}
            onClick={() => setHasInteracted(true)}
            onKeyDown={(event) => {
              setHasInteracted(true);
              if (event.key === 'Enter' && filteredSymbols.length > 0) {
                setSelectedSymbol(filteredSymbols[0]);
              }
            }}
          />
        </label>

        <div className={`App-content${selectedSymbol ? '' : ' is-single'}`}>
          <div className="App-list">
            {!hasInteracted && (
              <p className="App-empty">Click the search bar to view symbols.</p>
            )}
            {hasInteracted && status === 'success' && filteredSymbols.length === 0 && (
              <p className="App-empty">No symbols match that filter.</p>
            )}
            {hasInteracted && status === 'success' && filteredSymbols.length > 0 && (
              <ul>
                {pagedSymbols.map((symbol) => (
                  <li key={symbol}>
                    <button
                      type="button"
                      className={symbol === selectedSymbol ? 'is-active' : ''}
                      onClick={() => handleSymbolSelect(symbol)}
                    >
                      {symbol}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {hasInteracted && status === 'success' && filteredSymbols.length > 0 && (
              <div className="App-pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={clampedPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {clampedPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={clampedPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {selectedSymbol && (
            <div className="App-details">
              {detailsStatus === 'loading' && (
                <p className="App-empty">Loading details for {selectedSymbol}…</p>
              )}
              {detailsStatus === 'error' && (
                <p className="App-empty">
                  {detailsError?.message || 'Failed to load details.'}
                </p>
              )}
              {detailsStatus === 'success' && details && (
                <div className="App-details-card">
                  <div>
                    <p className="App-eyebrow">{details.info.symbol}</p>
                    <h2>{details.info.companyName}</h2>
                    <p className="App-subtitle">{details.info.industry}</p>
                  </div>

                  <div className="App-detail-grid">
                    <div>
                      <span>Last Price</span>
                      <strong>{formatNumber(details.priceInfo.lastPrice)}</strong>
                    </div>
                    <div>
                      <span>Change</span>
                      <strong className={priceChangeClass}>
                        {formatNumber(details.priceInfo.change)} (
                        {formatPercent(details.priceInfo.pChange)})
                      </strong>
                    </div>
                    <div>
                      <span>VWAP</span>
                      <strong>{formatNumber(details.priceInfo.vwap)}</strong>
                    </div>
                    <div>
                      <span>Listing Date</span>
                      <strong>{details.metadata.listingDate}</strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>{details.metadata.status}</strong>
                    </div>
                    <div>
                      <span>ISIN</span>
                      <strong>{details.metadata.isin}</strong>
                    </div>
                    <div>
                      <span>Sector Index</span>
                      <strong>{details.metadata.pdSectorInd}</strong>
                    </div>
                    <div>
                      <span>Market Segment</span>
                      <strong>{details.info.segment}</strong>
                    </div>
                  </div>

                  {details.info.activeSeries.length > 0 && (
                    <div className="App-tags">
                      {details.info.activeSeries.map((series) => (
                        <span key={series}>{series}</span>
                      ))}
                    </div>
                  )}

                  <p className="App-details-footnote">
                    Last updated {details.metadata.lastUpdateTime}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
