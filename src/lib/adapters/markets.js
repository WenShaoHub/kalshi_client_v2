/**
 * Adapter: API markets[] + optional eventByTicker -> MarketCard props shape.
 * API market: ticker, event_ticker, yes_sub_title, no_sub_title, last_price_dollars,
 * yes_bid_dollars, yes_ask_dollars, volume_fp, volume_24h_fp, status, close_time, title?, subtitle?
 * Event uses sub_title (05-SCHEMA / events response); market uses subtitle.
 */

function formatVolume(value) {
  if (value == null || Number.isNaN(Number(value))) return '$0'
  const n = Number(value)
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${Math.round(n)}`
}

/**
 * 卡片展示 market 字段：title, yes_ask_dollars, no_ask_dollars, yes_sub_title, no_sub_title 等。
 * outcomes 的 pct 使用 yes_ask_dollars / no_ask_dollars 转为百分比（无则回退 last_price_dollars）。
 */
export function adaptMarketForCard(market, options = {}) {
  const { category = '', eventByTicker = {} } = options
  const event = market.event_ticker ? eventByTicker[market.event_ticker] : null

  const yesAskPct = market.yes_ask_dollars != null
    ? Math.round(Number(market.yes_ask_dollars) * 100)
    : (market.last_price_dollars != null ? Math.round(Number(market.last_price_dollars) * 100) : 50)
  const noAskPct = market.no_ask_dollars != null
    ? Math.round(Number(market.no_ask_dollars) * 100)
    : (100 - yesAskPct)
  const yesLabel = market.yes_sub_title ?? 'Yes'
  const noLabel = market.no_sub_title ?? 'No'
  const volume = market.volume_24h_fp != null ? market.volume_24h_fp : market.volume_fp

  const title = market.title ?? market.subtitle ?? event?.title ?? market.event_ticker ?? market.ticker

  const createdTs = market.created_time ?? market.created_ts
  const isNew = createdTs != null && (Date.now() / 1000 - Number(createdTs)) < 7 * 24 * 3600

  return {
    id: market.ticker,
    category,
    eventSubtitle: event?.title ?? event?.sub_title ?? event?.subtitle ?? market.series_ticker ?? '',
    title,
    eventImage: event?.image_url ?? event?.image ?? null,
    outcomes: [
      { label: yesLabel, pct: yesAskPct, aiProb: null },
      { label: noLabel, pct: noAskPct, aiProb: null },
    ],
    volume: formatVolume(volume),
    isNew: !!isNew,
    priceChange: null,
    aiAnalysis: market.ai_analysis ?? null,
  }
}

/** Take a single display string; if API returned comma-separated list, use first segment only. */
function singleLabel(raw) {
  if (raw == null || typeof raw !== 'string') return '—'
  const s = raw.trim()
  if (!s) return '—'
  if (s.includes(', ')) return s.split(', ')[0].trim()
  return s
}

/** Prefer event title; avoid using concatenated "yes X, yes Y" as title. */
function eventOrMarketTitle(event, first) {
  const fromEvent = event?.title ?? (event?.data && event.data.title)
  if (fromEvent && typeof fromEvent === 'string') {
    const t = fromEvent.trim()
    if (t && t.length < 200 && !t.includes(', yes ')) return t
  }
  const fromMarket = first?.title ?? first?.subtitle
  if (fromMarket && typeof fromMarket === 'string') {
    const t = fromMarket.trim()
    if (t && t.length < 200 && !t.includes(', yes ')) return t
  }
  return first?.event_ticker ?? first?.ticker ?? 'Event'
}

/**
 * One card per event: title/category/image from event, outcomes from event's markets (max 2 rows).
 * Use when list is built by grouping markets by event_ticker.
 */
export function adaptEventForCard(event, markets, options = {}) {
  if (!Array.isArray(markets) || markets.length === 0) return null
  const first = markets[0]
  const ev = event && !Array.isArray(event) ? event : null
  const volumeVal = first.volume_24h_fp != null ? first.volume_24h_fp : first.volume_fp
  const createdTs = first.created_time ?? first.created_ts
  const createdSec = typeof createdTs === 'string' ? Date.parse(createdTs) / 1000 : Number(createdTs)
  const isNew = createdSec != null && !Number.isNaN(createdSec) && createdSec > 0 && (Date.now() / 1000 - createdSec) < 7 * 24 * 3600

  const outcomes = markets.slice(0, 2).map((m) => {
    const pct = m.last_price_dollars != null ? Math.round(Number(m.last_price_dollars) * 100) : 0
    const rawLabel = m.yes_sub_title ?? m.no_sub_title ?? m.title ?? '—'
    const label = singleLabel(rawLabel)
    return { label, pct, aiProb: m.ai_probability ?? null }
  })

  const title = eventOrMarketTitle(ev, first)
  const eventSubtitle = ev?.sub_title ?? ev?.category ?? ''
  const category = ev?.category ?? options.category ?? ''

  return {
    id: first.ticker,
    title,
    eventSubtitle,
    category,
    eventImage: ev?.image_url ?? ev?.image ?? null,
    outcomes,
    volume: formatVolume(volumeVal),
    isNew: !!isNew,
    priceChange: null,
    aiAnalysis: first.ai_analysis ?? ev?.ai_analysis ?? null,
  }
}

export function adaptMarketsList(markets, options = {}) {
  if (!Array.isArray(markets)) return []
  return markets.map((m) => adaptMarketForCard(m, options))
}

/**
 * 单 event → 一张卡片（数据来自 GET /api/v1/events 且 with_nested_markets=true）。
 * 事件对应概率：(yes_ask + yes_bid) / 2；AI 分析文本：event.blindspots + event.anchors。
 */
export function adaptEventToCard(event) {
  const markets = Array.isArray(event?.markets) ? event.markets : []
  if (markets.length === 0) return null

  const first = markets[0]
  const volumeVal = first.volume_24h_fp != null ? first.volume_24h_fp : first.volume_fp
  const isNew = markets.some((m) => {
    const createdTs = m.created_time ?? m.created_ts
    if (createdTs == null) return false
    const sec = typeof createdTs === 'string' ? Date.parse(createdTs) / 1000 : Number(createdTs)
    return !Number.isNaN(sec) && sec > 0 && (Date.now() / 1000 - sec) < 7 * 24 * 3600
  })

  const aiParts = [event.anchors, event.blindspots].filter(Boolean)
  const aiAnalysis = aiParts.length > 0 ? aiParts.join('\n\n') : null

  const outcomes = markets.map((m) => {
    const yesAsk = Number(m.yes_ask)
    const yesBid = Number(m.yes_bid)
    const bothValid = m.yes_ask != null && m.yes_bid != null && !Number.isNaN(yesAsk) && !Number.isNaN(yesBid)
    const pctRaw = (yesAsk + yesBid) / 2
    const pct = bothValid ? Math.round(pctRaw) : (m.last_price ?? 0)
    return {
      label: m.yes_sub_title ?? m.title ?? '—',
      pct,
      aiProb: m.yes_calibration ?? null,
    }
  })

  return {
    id: first.ticker,
    title: event.title ?? first.title ?? '',
    eventSubtitle: event.sub_title ?? event.category ?? '',
    category: event.category ?? '',
    eventImage: null,
    outcomes,
    volume: formatVolume(volumeVal),
    isNew: !!isNew,
    priceChange: null,
    aiAnalysis,
  }
}

/** events 数组 → 卡片数组，过滤掉无 markets 或 markets 空的 event。 */
export function adaptEventsToCards(events) {
  if (!Array.isArray(events)) return []
  return events.map(adaptEventToCard).filter(Boolean)
}
