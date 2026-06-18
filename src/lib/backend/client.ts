import { BackendError, BackendPayload } from './backend-error';

const BACKEND_URL = process.env.BACKEND_URL!;

// Default timeout (ms)
const DEFAULT_TIMEOUT = 10_000; // 10 seconds

export async function backendFetch<T>(
  path: string,
  options?: RequestInit & {
    timeoutMs?: number;
    token?: string;
    params?: Record<string, string | number | boolean | undefined>;
  },
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let finalPath = path;

  if (options?.params && options.method === 'GET') {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined && v !== null) {
        sp.append(k, String(v));
      }
    }
    const qs = sp.toString();
    if (qs) finalPath = `${path}?${qs}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}${finalPath}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Role': 'transportation_company',
        ...options?.headers,
        ...(options?.token ? { 'Authorization': `Bearer ${options?.token}` } : {}),
      },
      cache: 'no-store',
    });

    let payload: BackendPayload | null = null;

    try {
      payload = (await res.json()) as BackendPayload;
    } catch {
      payload = null;
    }

    if (!res.ok) {
      console.log('BACKEND_ERROR: ', res)
      throw new BackendError(res.status, payload?.message ?? 'خطا');
    }

    return payload as T;

  } catch (err) {
    // ✅ Timeout / Abort
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new BackendError(504, 'طولانی شدن زمان درخواست');
    }

    // ✅ Network / DNS / connection errors
    if (err instanceof TypeError) {
      throw new BackendError(503, 'سرور در دسترس نیست');
    }
    if (err instanceof BackendError) {
      throw new BackendError(err.status, err.message);
    }

    throw err;

  } finally {
    clearTimeout(timeoutId);
  }
}
