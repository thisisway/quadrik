const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const KEY = 'quadrik_auth'

interface StoredAuth {
  accessToken: string
  refreshToken: string
  [key: string]: unknown
}

function getAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as StoredAuth } catch { return null }
}

function setAccessToken(token: string) {
  const auth = getAuth()
  if (!auth) return
  localStorage.setItem(KEY, JSON.stringify({ ...auth, accessToken: token }))
}

async function refreshTokens(): Promise<string | null> {
  const auth = getAuth()
  if (!auth?.refreshToken) return null
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: auth.refreshToken }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { accessToken: string; refreshToken: string }
    localStorage.setItem(KEY, JSON.stringify({ ...auth, accessToken: data.accessToken, refreshToken: data.refreshToken }))
    return data.accessToken
  } catch {
    return null
  }
}

type RequestOptions = RequestInit & { withAuth?: boolean; _retry?: boolean }

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { withAuth = true, _retry = false, headers: rawHeaders, ...init } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rawHeaders as Record<string, string> | undefined),
  }

  if (withAuth) {
    const auth = getAuth()
    if (auth) headers['Authorization'] = `Bearer ${auth.accessToken}`
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers })

  // Auto-refresh on 401 and retry once
  if (res.status === 401 && withAuth && !_retry) {
    const newToken = await refreshTokens()
    if (newToken) {
      return request<T>(path, { ...options, _retry: true })
    }
    // Refresh failed — clear auth and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEY)
      window.location.href = '/login'
    }
    throw new Error('Sessão expirada. Faça login novamente.')
  }

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
