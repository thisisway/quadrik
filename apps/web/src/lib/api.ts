const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type RequestOptions = RequestInit & { withAuth?: boolean }

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { withAuth = true, headers: rawHeaders, ...init } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rawHeaders as Record<string, string> | undefined),
  }

  if (withAuth && typeof window !== 'undefined') {
    const raw = localStorage.getItem('quadrik_auth')
    if (raw) {
      const auth = JSON.parse(raw) as { accessToken: string }
      headers['Authorization'] = `Bearer ${auth.accessToken}`
    }
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    const err = new Error((data as { message?: string }).message ?? `HTTP ${res.status}`) as Error & {
      status: number
      data: unknown
    }
    err.status = res.status
    err.data = data
    throw err
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown, withAuth = true) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), withAuth }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
