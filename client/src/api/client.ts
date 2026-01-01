const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

async function apiGet<T>(
  path: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  console.log('API Request:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
      signal,
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error('API Error:', error);
    throw error;
  }
}

export { apiGet, API_BASE_URL };
