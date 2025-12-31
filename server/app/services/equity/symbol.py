from __future__ import annotations

from collections.abc import Iterable

from .client import EquityMarketClient


class SymbolDataReader:
    """Fetch and parse symbol data from the market server."""

    def __init__(self, client: EquityMarketClient | None = None) -> None:
        self.client = client or EquityMarketClient()

    def fetch_symbol(self, symbol: str) -> dict:
        """Fetch symbol data and parse JSON using orjson."""
        normalized = symbol.strip()
        if not normalized:
            raise ValueError("symbol must be a non-empty string")

        return self.client.get_json(f"/api/equity/{normalized}")

    def fetch_symbols(self, symbols: Iterable[str]) -> dict[str, dict]:
        """Fetch data for each symbol and return a mapping."""
        return {symbol: self.fetch_symbol(symbol) for symbol in symbols}

    def close(self) -> None:
        """Close the underlying HTTP session."""
        self.client.close()
