import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllSymbols } from '../api/symbols';
import './HomePage.css';

const EXAMPLE_SYMBOLS = [
  'Coastal Corp',
  'Frontier Springs',
  'Grand Continent',
  'HBL Engineering',
  'Krishca Strapp.',
  'Modison',
  'Pix Transmission',
  'RACL Geartech',
  'Sandur Manganese',
  'Wanbury',
];

function HomePage() {
  const [query, setQuery] = useState('');
  const [allSymbols, setAllSymbols] = useState<string[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load all symbols on mount
  useEffect(() => {
    const controller = new AbortController();

    async function loadSymbols() {
      setIsLoading(true);
      console.log('Loading all symbols...');
      try {
        const data = await fetchAllSymbols({ signal: controller.signal });
        console.log('Loaded symbols:', data.length);
        setAllSymbols(data);
      } catch (error) {
        console.error('Error loading symbols:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSymbols();

    return () => controller.abort();
  }, []);

  // Filter symbols as user types
  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredSymbols([]);
      setShowSuggestions(false);
      return;
    }

    const searchQuery = query.trim().toUpperCase();
    const matches = allSymbols
      .filter((symbol) => symbol.toUpperCase().includes(searchQuery))
      .slice(0, 10); // Show max 10 suggestions

    setFilteredSymbols(matches);
    setShowSuggestions(matches.length > 0);
  }, [query, allSymbols]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    console.log('Search submitted:', trimmedQuery);
    if (trimmedQuery) {
      const symbolPath = `/symbol/${trimmedQuery.toUpperCase()}`;
      console.log('Navigating to:', symbolPath);
      setShowSuggestions(false);
      navigate(symbolPath);
    } else {
      console.log('Empty query, not navigating');
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    console.log('Suggestion clicked:', symbol);
    setQuery(symbol);
    setShowSuggestions(false);
    navigate(`/symbol/${symbol}`);
  };

  const handleExampleClick = (symbol: string) => {
    // Extract just the symbol (first word in uppercase)
    const symbolCode = symbol.split(' ')[0].toUpperCase();
    navigate(`/symbol/${symbolCode}`);
  };

  return (
    <div className="HomePage">
      <div className="HomePage-container">
        <div className="HomePage-brand">
          <span className="HomePage-brand-text">Quant</span>
          <span className="HomePage-brand-accent">xis</span>
        </div>

        <p className="HomePage-tagline">
          Stock analysis and screening tool for investors in India.
        </p>

        <form onSubmit={handleSearch} className="HomePage-search">
          <div className="HomePage-search-wrapper" ref={suggestionsRef}>
            <svg
              className="HomePage-search-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              placeholder={isLoading ? 'Loading symbols...' : 'Search for a company'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (filteredSymbols.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="HomePage-search-input"
              autoComplete="off"
              disabled={isLoading}
            />
            <button type="submit" className="HomePage-search-submit" disabled={isLoading}>
              Search
            </button>

            {showSuggestions && filteredSymbols.length > 0 && (
              <div className="HomePage-suggestions">
                {filteredSymbols.map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => handleSuggestionClick(symbol)}
                    className="HomePage-suggestion"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="HomePage-examples">
          <span className="HomePage-examples-label">Or analyse:</span>
          <div className="HomePage-examples-grid">
            {EXAMPLE_SYMBOLS.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleExampleClick(symbol)}
                className="HomePage-example-btn"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
