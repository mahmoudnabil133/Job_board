/** API base path (e.g. `/api` with Vite proxy, or full URL in production). */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (raw != null && raw !== '') {
    return raw.replace(/\/$/, '');
  }
  return '/api';
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export type ApiErrorBody = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  status?: string;
  success?: boolean;
};

export function flattenApiErrors(data: unknown): string[] {
  if (!data || typeof data !== 'object') return [];
  const d = data as ApiErrorBody;
  const out: string[] = [];
  if (d.errors && typeof d.errors === 'object') {
    for (const msgs of Object.values(d.errors)) {
      if (Array.isArray(msgs)) out.push(...msgs.filter((m) => typeof m === 'string'));
    }
  }
  if (typeof d.error === 'string' && d.error) out.push(d.error);
  if (typeof d.message === 'string' && d.message) out.push(d.message);
  return [...new Set(out)];
}

export function getPrimaryApiMessage(data: unknown, fallback: string): string {
  const list = flattenApiErrors(data);
  return list[0] ?? fallback;
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

export type FetchJsonOptions = RequestInit & {
  token?: string | null;
};

export type FetchJsonSuccess<T> = { ok: true; data: T };
export type FetchJsonFailure = { ok: false; status: number; data: unknown };
export type FetchJsonResult<T> = FetchJsonSuccess<T> | FetchJsonFailure;

export function isFetchJsonFailure<T>(r: FetchJsonResult<T>): r is FetchJsonFailure {
  return r.ok === false;
}

export async function fetchJson<T>(path: string, options: FetchJsonOptions = {}): Promise<FetchJsonResult<T>> {
  const { token, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (!headers.has('Content-Type') && rest.body && !(rest.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(apiUrl(path), { ...rest, headers });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    return { ok: false as const, status: res.status, data };
  }
  return { ok: true as const, data: data as T };
}
