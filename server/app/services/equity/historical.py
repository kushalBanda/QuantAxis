from __future__ import annotations

from .client import EquityMarketClient


class HistoricalDataReader:
    """Fetch and parse historical equity data from the market server."""

    def __init__(self, client: EquityMarketClient | None = None) -> None:
        self.client = client or EquityMarketClient()

    def fetch_history(self, symbol: str, date_start: str, date_end: str) -> dict:
        """Fetch historical data for a symbol within a date range."""
        normalized = symbol.strip()
        if not normalized:
            raise ValueError("symbol must be a non-empty string")
        if not date_start or not date_end:
            raise ValueError("date_start and date_end are required")

        return self.client.get_json(
            f"/api/equity/historical/{normalized}",
            params={"dateStart": date_start, "dateEnd": date_end},
        )

    def close(self) -> None:
        """Close the underlying HTTP session."""
        self.client.close()
