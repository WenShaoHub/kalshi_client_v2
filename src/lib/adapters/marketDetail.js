/**
 * Adapter: API market (and optional event + nested markets) -> MarketDetail page shape.
 * Single market: binary Yes/No -> two candidates.
 * Event with nested markets: each market -> one candidate.
 * chartData: no API -> null (UI shows volume only or hides chart).
 * Event uses sub_title (05-SCHEMA / events response); market uses subtitle.
 */

const COLOR_KEYS = ['green', 'blue', 'black', 'green', 'blue']

function formatVolume(value) {
  if (value == null || Number.isNaN(Number(value))) return '$0'
  const n = Number(value)
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${Math.round(n)}`
}

function dollarsToCents(d) {
  if (d == null || Number.isNaN(Number(d))) return null
  return Math.round(Number(d) * 100)
}

/** Human 概率：与 2.2 一致，(yes_ask + yes_bid) / 2 当两者均有效，否则 last_price。 */
function humanPct(m) {
  const yesAsk = Number(m.yes_ask)
  const yesBid = Number(m.yes_bid)
  const bothValid = m.yes_ask != null && m.yes_bid != null && !Number.isNaN(yesAsk) && !Number.isNaN(yesBid)
  if (bothValid) return Math.round((yesAsk + yesBid) / 2)
  const lp = m.last_price != null ? Number(m.last_price) : (m.last_price_dollars != null ? Number(m.last_price_dollars) * 100 : 50)
  return Math.round(lp)
}

/** Yes/No 价格（分）：API 返回 yes_bid/no_bid 时直接使用，否则由 _dollars 转分。 */
function yesCents(m, fallbackDollars) {
  if (m.yes_bid != null && !Number.isNaN(Number(m.yes_bid))) return Math.round(Number(m.yes_bid))
  if (m.yes_ask != null && !Number.isNaN(Number(m.yes_ask))) return Math.round(Number(m.yes_ask))
  return dollarsToCents(m.yes_bid_dollars ?? m.yes_ask_dollars ?? fallbackDollars)
}
function noCents(m, fallbackDollars) {
  if (m.no_bid != null && !Number.isNaN(Number(m.no_bid))) return Math.round(Number(m.no_bid))
  if (m.no_ask != null && !Number.isNaN(Number(m.no_ask))) return Math.round(Number(m.no_ask))
  return dollarsToCents(m.no_bid_dollars ?? m.no_ask_dollars ?? fallbackDollars)
}

export function adaptMarketDetail(market, options = {}) {
  const { event = null, nestedMarkets = [] } = options
  const isMulti = Array.isArray(nestedMarkets) && nestedMarkets.length > 0
  const markets = isMulti ? nestedMarkets : [market]
  const primary = market

  let title = primary.title ?? primary.subtitle ?? event?.title ?? primary.ticker
  if (!title && (primary.yes_sub_title || primary.no_sub_title)) {
    title = [primary.yes_sub_title, primary.no_sub_title].filter(Boolean).join(' / ')
  }
  const category = event?.category ?? primary.series_ticker ?? 'Market'
  const subcategory = event?.sub_title ?? event?.subtitle ?? event?.series_ticker ?? ''
  const eventImage = event?.image_url ?? event?.image ?? null
  const volume = primary.volume_fp != null ? primary.volume_fp : primary.volume_24h_fp
  const disclaimer =
    primary.rules_primary ??
    event?.rules_primary ??
    (event?.product_metadata?.important_info?.markdown ?? event?.product_metadata?.important_info?.message) ??
    event?.description ??
    primary.description ??
    null
  const aiParts = event && [event.anchors, event.blindspots].filter(Boolean)
  const aiAnalysis =
    (aiParts && aiParts.length > 0 ? aiParts.join('\n\n') : null) ??
    primary.ai_analysis ??
    event?.ai_analysis ??
    null

  let summaryCandidates
  if (!isMulti && market.yes_sub_title != null && market.no_sub_title != null) {
    const pctYes = humanPct(market)
    summaryCandidates = [
      { name: market.yes_sub_title, pct: Math.round(pctYes * 10) / 10, colorKey: 'green' },
      { name: market.no_sub_title, pct: Math.round((100 - pctYes) * 10) / 10, colorKey: 'blue' },
    ]
  } else {
    summaryCandidates = markets.slice(0, 5).map((m, i) => {
      const name = m.yes_sub_title ?? m.no_sub_title ?? 'Outcome'
      const pct = humanPct(m)
      return { name, pct: Math.round(pct * 10) / 10, colorKey: COLOR_KEYS[i % COLOR_KEYS.length] }
    })
  }

  const candidates = []
  if (!isMulti && market.yes_sub_title != null && market.no_sub_title != null) {
    const lastPriceDollars = market.last_price_dollars != null ? Number(market.last_price_dollars) : (market.last_price != null ? Number(market.last_price) / 100 : 0.5)
    const pctYes = humanPct(market)
    candidates.push(
      {
        id: `${market.ticker}-yes`,
        name: market.yes_sub_title,
        avatar: null,
        pct: pctYes,
        change: null,
        changeDir: null,
        yesCents: yesCents(market, lastPriceDollars),
        noCents: noCents(market, 1 - lastPriceDollars),
      },
      {
        id: `${market.ticker}-no`,
        name: market.no_sub_title,
        avatar: null,
        pct: 100 - pctYes,
        change: null,
        changeDir: null,
        yesCents: yesCents(market, lastPriceDollars),
        noCents: noCents(market, 1 - lastPriceDollars),
      }
    )
  } else {
    markets.forEach((m, i) => {
      const lastPriceDollars = m.last_price_dollars != null ? Number(m.last_price_dollars) : (m.last_price != null ? Number(m.last_price) / 100 : 0.5)
      const pctVal = humanPct(m)
      const name = m.yes_sub_title ?? m.no_sub_title ?? (m.ticker || `Option ${i + 1}`)
      candidates.push({
        id: m.ticker,
        name,
        avatar: null,
        pct: pctVal,
        change: null,
        changeDir: null,
        yesCents: yesCents(m, lastPriceDollars),
        noCents: noCents(m, 1 - lastPriceDollars),
      })
    })
  }

  return {
    id: primary.ticker,
    title,
    category,
    subcategory,
    eventImage,
    volume: formatVolume(volume),
    disclaimer,
    aiAnalysis,
    summaryCandidates,
    chartData: null,
    candidates,
  }
}
