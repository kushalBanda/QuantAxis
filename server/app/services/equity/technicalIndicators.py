from __future__ import annotations

from collections.abc import Iterable

from .client import EquityMarketClient


class TechnicalIndicatorsReader:
    """Fetch technical indicators for an equity symbol."""

    def __init__(self, client: EquityMarketClient | None = None) -> None:
        self.client = client or EquityMarketClient()

    def fetch_indicators(
        self,
        symbol: str,
        *,
        period: int = 200,
        sma_periods: Iterable[int] | str = (5, 10, 20, 50, 100, 200),
        ema_periods: Iterable[int] | str = (5, 10, 20, 50, 100, 200),
        rsi_period: int = 14,
        bb_period: int = 20,
        bb_std_dev: float = 2,
        show_only_latest: bool = True,
    ) -> dict:
        """Fetch technical indicators with query defaults from the API."""
        normalized = symbol.strip()
        if not normalized:
            raise ValueError("symbol must be a non-empty string")

        params = {
            "period": str(period),
            "smaPeriods": self._format_periods(sma_periods),
            "emaPeriods": self._format_periods(ema_periods),
            "rsiPeriod": str(rsi_period),
            "bbPeriod": str(bb_period),
            "bbStdDev": str(bb_std_dev),
            "showOnlyLatest": str(show_only_latest).lower(),
        }
        return self.client.get_json(
            f"/api/equity/technicalIndicators/{normalized}",
            params=params,
        )

    def close(self) -> None:
        """Close the underlying HTTP session."""
        self.client.close()

    @staticmethod
    def _format_periods(periods: Iterable[int] | str) -> str:
        if isinstance(periods, str):
            return periods
        return ",".join(str(period) for period in periods)
