from __future__ import annotations

from collections.abc import Iterable

import requests

from .historical import HistoricalDataReader
from .technicalIndicators import TechnicalIndicatorsReader
from .client import EquityMarketClient
from .symbol import SymbolDataReader


def fetch_symbol_data(
    symbol: str,
    base_url: str = "http://localhost:3000",
    client: EquityMarketClient | None = None,
) -> dict:
    """Fetch symbol data for a single symbol."""
    local_client = client or EquityMarketClient(base_url=base_url)
    reader = SymbolDataReader(client=local_client)
    try:
        return reader.fetch_symbol(symbol)
    finally:
        if client is None:
            reader.close()


def fetch_symbols_data(
    symbols: Iterable[str],
    base_url: str = "http://localhost:3000",
    client: EquityMarketClient | None = None,
) -> dict[str, dict]:
    """Fetch symbol data for a list of symbols."""
    local_client = client or EquityMarketClient(base_url=base_url)
    reader = SymbolDataReader(client=local_client)
    try:
        return reader.fetch_symbols(symbols)
    finally:
        if client is None:
            reader.close()


def fetch_historical_data(
    symbols: Iterable[str],
    start_date: str,
    end_date: str,
    base_url: str = "http://localhost:3000",
    client: EquityMarketClient | None = None,
) -> dict[str, dict]:
    """Fetch historical data for a list of symbols within a date range."""
    local_client = client or EquityMarketClient(base_url=base_url)
    reader = HistoricalDataReader(client=local_client)
    try:
        return {
            symbol: reader.fetch_history(symbol, start_date, end_date)
            for symbol in symbols
        }
    finally:
        if client is None:
            reader.close()


def fetch_technical_indicators_data(
    symbols: Iterable[str],
    base_url: str = "http://localhost:3000",
    client: EquityMarketClient | None = None,
) -> dict[str, dict]:
    """Fetch technical indicators for a list of symbols."""
    local_client = client or EquityMarketClient(base_url=base_url)
    reader = TechnicalIndicatorsReader(client=local_client)
    try:
        results: dict[str, dict] = {}
        for symbol in symbols:
            try:
                results[symbol] = reader.fetch_indicators(symbol)
            except requests.HTTPError as exc:
                response = exc.response
                results[symbol] = {
                    "error": "Failed to fetch technical indicators.",
                    "status_code": response.status_code if response else None,
                    "details": response.text if response else str(exc),
                }
        return results
    finally:
        if client is None:
            reader.close()