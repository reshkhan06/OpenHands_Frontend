const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return headers;
}

function toUserFriendlyMessage(e: unknown): string {
  if (e instanceof TypeError && (e.message === 'Failed to fetch' || e.message.includes('fetch'))) {
    return 'Network error. Please check your connection and try again.';
  }
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e !== null && 'message' in e) return String((e as { message: unknown }).message);
  return 'Something went wrong. Please try again.';
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options.headers as Record<string, string>) },
    });
  } catch (e) {
    throw new Error(toUserFriendlyMessage(e));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = typeof err.detail === 'string' ? err.detail : Array.isArray(err.detail)
      ? err.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('. ') || res.statusText
      : JSON.stringify(err.detail ?? res.statusText);
    throw new Error(msg);
  }
  return res.json();
}
