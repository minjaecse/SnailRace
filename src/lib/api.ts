const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://43.200.145.225';

export type HealthCheckResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

async function checkHealth(path: string, errorMessage: string): Promise<HealthCheckResult> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  const text = await response.text();
  const data = text ? parseResponseBody(text) : null;

  return {
    ok: true,
    status: response.status,
    data,
  };
}

export function checkAuthHealth() {
  return checkHealth('/auth/health', 'auth health check failed');
}

export function checkUserHealth() {
  return checkHealth('/user/health', 'user health check failed');
}

function parseResponseBody(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
