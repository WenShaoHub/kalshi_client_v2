/**
 * API client for kalshi-markets backend.
 * Base URL from VITE_API_BASE_URL (dev: localhost:5000, prod: Railway).
 * All responses: { success: true, data } or { success: false, error: { code, message } }.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const method = (options.method || 'GET').toUpperCase()
  console.log('[API]', method, url, '| VITE_API_BASE_URL:', BASE_URL)
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.warn('[API]', res.status, url, '| error:', json.error || res.statusText)
    return { success: false, error: json.error || { code: 'HTTP_ERROR', message: res.statusText } }
  }
  if (json.success === false) {
    console.warn('[API]', url, '| API error:', json.error)
    return { success: false, error: json.error || { code: 'API_ERROR', message: 'Unknown error' } }
  }
  console.log('[API]', res.status, url, '| ok')
  return { success: true, data: json.data }
}

export async function getCategories() {
  return request('/api/v1/categories')
}

export async function getSeries(params = {}) {
  const q = new URLSearchParams()
  if (params.category != null) q.set('category', params.category)
  if (params.tags != null) q.set('tags', params.tags)
  if (params.include_product_metadata != null) q.set('include_product_metadata', params.include_product_metadata)
  if (params.include_volume != null) q.set('include_volume', params.include_volume)
  const query = q.toString()
  return request(`/api/v1/series${query ? `?${query}` : ''}`)
}

export async function getMarkets(params = {}) {
  const q = new URLSearchParams()
  if (params.limit != null) q.set('limit', params.limit)
  if (params.cursor != null) q.set('cursor', params.cursor)
  if (params.event_ticker != null) q.set('event_ticker', params.event_ticker)
  if (params.series_ticker != null) q.set('series_ticker', params.series_ticker)
  if (params.status != null) q.set('status', params.status)
  if (params.tickers != null) q.set('tickers', params.tickers)
  if (params.sort != null) q.set('sort', params.sort)
  if (params.min_close_ts != null) q.set('min_close_ts', params.min_close_ts)
  const query = q.toString()
  return request(`/api/v1/markets${query ? `?${query}` : ''}`)
}

export async function getMarket(ticker) {
  return request(`/api/v1/markets/${encodeURIComponent(ticker)}`)
}

export async function getEvent(eventTicker, params = {}) {
  const q = new URLSearchParams()
  if (params.with_nested_markets != null) q.set('with_nested_markets', params.with_nested_markets)
  const query = q.toString()
  return request(`/api/v1/events/${encodeURIComponent(eventTicker)}${query ? `?${query}` : ''}`)
}

export async function getEventMetadata(eventTicker) {
  return request(`/api/v1/events/${encodeURIComponent(eventTicker)}/metadata`)
}

/** 事件列表，列表页请传 with_nested_markets: true。返回 data.events、data.cursor、可选 data.milestones。 */
export async function getEvents(params = {}) {
  const q = new URLSearchParams()
  if (params.limit != null) q.set('limit', params.limit)
  if (params.cursor != null) q.set('cursor', params.cursor)
  if (params.with_nested_markets != null) q.set('with_nested_markets', params.with_nested_markets)
  if (params.with_milestones != null) q.set('with_milestones', params.with_milestones)
  if (params.status != null) q.set('status', params.status)
  if (params.series_ticker != null) q.set('series_ticker', params.series_ticker)
  if (params.min_close_ts != null) q.set('min_close_ts', params.min_close_ts)
  const query = q.toString()
  return request(`/api/v1/events${query ? `?${query}` : ''}`)
}

export { BASE_URL }
