from __future__ import annotations

import orjson
import requests


class EquityMarketClient:
    """HTTP client for the equity market server."""

    def __init__(
        self,
        base_url: str = "http://localhost:3000",
        *,
        session: requests.Session | None = None,
        timeout_seconds: float = 15.0,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.session = session or requests.Session()
        self.timeout_seconds = timeout_seconds
        

    def get_json(self, path: str, *, params: dict[str, str] | None = None) -> dict:
        """GET a JSON payload and parse it with orjson."""
        url = f"{self.base_url}/{path.lstrip('/')}"
        response = self.session.get(
            url,
            headers={"accept": "*/*"},
            params=params,
            timeout=self.timeout_seconds,
        )
        response.raise_for_status()
        try:
            return orjson.loads(response.content)
        except orjson.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON response from {url}") from exc

    def close(self) -> None:
        """Close the underlying HTTP session."""
        self.session.close()
