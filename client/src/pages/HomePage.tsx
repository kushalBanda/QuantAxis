import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/symbol/${query.trim().toUpperCase()}`);
    }
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
          <div className="HomePage-search-wrapper">
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
              type="search"
              placeholder="Search for a company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="HomePage-search-input"
            />
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
