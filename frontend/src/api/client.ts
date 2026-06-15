
/**
 * バックエンドのAPIを叩く
*/

// バックエンドのURL
const BASE_URL = 'http://localhost:8787'

/**
 * ローカルストレージのトークンを取得
 * -----------------------------------*/ 
function getToken() {
  return localStorage.getItem('token')
}

/**
 * トークンをローカルストレージへ保存
 * -----------------------------------*/ 
export function saveToken(token: string) {
  localStorage.setItem('token', token)
}

/**
 * ローカルストレージのトークンをリセット
 * -----------------------------------*/ 
export function removeToken() {
  localStorage.removeItem('token')
}

/**
 * ログインしているかどうか
 * （ローカルストレージにトークンがあるか否か）
 * -----------------------------------*/ 
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 認証ヘッダー付きのHTTPリクエストを送る基底関数
 * 全てのapi.get/post/patchはこれを通る
 * -----------------------------------*/ 
// リクエスト関数
async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// 実行関数
export const api = {
  post: (path: string, body: unknown) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  get: (path: string) =>
    request(path),
  patch: (path: string, body?: unknown) =>
    request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
}