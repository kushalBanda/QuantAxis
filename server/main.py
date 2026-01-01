import orjson
from collections.abc import Iterable
from __future__ import annotations

from app.services.equity.client import EquityMarketClient
from app.services.equity.equity import fetch_symbol_data, fetch_symbols_data, fetch_historical_data, fetch_technical_indicators_data


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
            # "symbols": fetch_symbols_data(symbols, client=client),
            "historical": fetch_historical_data(
                symbols,
                start_date,
                end_date,
                client=client,
            ),
            # "technicalIndicators": fetch_technical_indicators_data(
            #     symbols,
            #     client=client,
            # ),
        }
    finally:
        client.close()
    print(orjson.dumps(payload, option=orjson.OPT_INDENT_2).decode())


if __name__ == "__main__":
    user_symbols = ["ANANDRATHI", "ANANTRAJ", "CAPLIPOINT"]
    start_date = "2025-01-01"
    end_date = "2025-01-05"
    main(user_symbols, start_date, end_date)
