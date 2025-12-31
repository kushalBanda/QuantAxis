from __future__ import annotations

from collections.abc import Iterable

import orjson

from app.services.equity.historical import HistoricalDataReader
from app.services.equity.technicalIndicators import TechnicalIndicatorsReader
from app.services.equity.client import EquityMarketClient
from app.services.equity.symbol import SymbolDataReader


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
        return {symbol: reader.fetch_indicators(symbol) for symbol in symbols}
    finally:
        if client is None:
            reader.close()


def main(
    symbols: Iterable[str],
    start_date: str,
    end_date: str,
    base_url: str = "http://localhost:3000",
) -> None:
    """Fetch symbol and historical data and print combined JSON."""
    client = EquityMarketClient(base_url=base_url)
    try:
        payload = {
            "symbols": fetch_symbols_data(symbols, client=client),
            "historical": fetch_historical_data(
                symbols,
                start_date,
                end_date,
                client=client,
            ),
            "technicalIndicators": fetch_technical_indicators_data(
                symbols,
                client=client,
            ),
        }
    finally:
        client.close()
    print(orjson.dumps(payload, option=orjson.OPT_INDENT_2).decode())


if __name__ == "__main__":
    user_symbols = ["ACC", "TCS", "HDFC", "INFY"]
    start_date = "2025-01-01"
    end_date = "2025-12-31"
    main(user_symbols, start_date, end_date)
