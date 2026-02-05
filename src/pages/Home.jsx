import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import TabsBar from '../components/TabsBar'
import CategoryBar from '../components/CategoryBar'
import SubCategoryBar from '../components/SubCategoryBar'
import MarketCard from '../components/MarketCard'
import Footer from '../components/Footer'
import AlphaToggle from '../components/AlphaToggle'
import { getCategories, getSeries, getEvents } from '../lib/api'
import { adaptEventsToCards } from '../lib/adapters/markets'
import './Home.css'

const EVENTS_FETCH_LIMIT = 100
const SERIES_FETCH_LIMIT = 8
const EVENTS_PER_SERIES = 50

const FALLBACK_CATEGORY_LABELS = {
  politics: 'Politics',
  sports: 'Sports',
  culture: 'Culture',
  crypto: 'Crypto',
  climate: 'Climate',
  economics: 'Economics',
  mentions: 'Mentions',
  companies: 'Companies',
  financials: 'Financials',
  science: 'Tech & Science',
}

export default function Home() {
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [cards, setCards] = useState([])
  const [cardsLoading, setCardsLoading] = useState(true)
  const [cardsError, setCardsError] = useState(null)
  const [activeTab, setActiveTab] = useState('trending')
  const [activeCategory, setActiveCategory] = useState('politics')
  const [activeSub, setActiveSub] = useState('for-you')
  const [alphaOn, setAlphaOn] = useState(false)

  /* /category/all 或 /category/:id 时以 URL 为准，否则用 tab/分类状态 */
  const fromCategoryRoute = categoryId != null
  const showAll = fromCategoryRoute ? categoryId === 'all' : activeTab === 'all'
  const effectiveCategory =
    fromCategoryRoute ? (categoryId === 'all' ? 'all' : categoryId) : activeCategory
  const effectiveTab = fromCategoryRoute && categoryId === 'all' ? 'all' : activeTab

  useEffect(() => {
    let cancelled = false
    getCategories().then((res) => {
      if (cancelled) return
      if (res.success && Array.isArray(res.data?.categories)) {
        setCategories(res.data.categories)
      }
    })
    return () => { cancelled = true }
  }, [])

  /* series 接口需要 category 为 categories 返回的 label（首字母大写，如 Politics） */
  const categoryParamForSeries =
    effectiveCategory === 'all'
      ? undefined
      : (categories.find(
          (c) => (c.id ?? '').toLowerCase() === (effectiveCategory ?? '').toLowerCase()
        )?.label ??
        `${(effectiveCategory ?? '').charAt(0).toUpperCase()}${(effectiveCategory ?? '').slice(1).toLowerCase()}`)

  /* 数据流: getEvents(with_nested_markets) 或 getSeries → getEvents(series_ticker) → 排序后适配为卡片 */
  useEffect(() => {
    let cancelled = false
    setCardsLoading(true)
    setCardsError(null)

    const sortByNew = effectiveTab === 'new'

    function loadEvents() {
      if (effectiveCategory === 'all' || categoryParamForSeries == null) {
        return getEvents({ with_nested_markets: true, limit: EVENTS_FETCH_LIMIT }).then((res) =>
          res?.success && Array.isArray(res.data?.events) ? res.data.events : []
        )
      }
      return getSeries({ category: categoryParamForSeries }).then((res) => {
        if (!res?.success || !Array.isArray(res.data?.series)) return []
        const seriesList = (res.data.series || []).slice(0, SERIES_FETCH_LIMIT)
        if (seriesList.length === 0) return []
        return Promise.all(
          seriesList.map((s) =>
            getEvents({
              series_ticker: s.ticker,
              with_nested_markets: true,
              limit: EVENTS_PER_SERIES,
            }).then((r) => (r?.success && Array.isArray(r.data?.events) ? r.data.events : []))
          )
        ).then((eventArrays) => {
          const byTicker = new Map()
          for (const arr of eventArrays) {
            for (const ev of arr) {
              if (ev?.event_ticker) byTicker.set(ev.event_ticker, ev)
            }
          }
          return Array.from(byTicker.values())
        })
      })
    }

    loadEvents()
      .then((events) => {
        if (cancelled || !Array.isArray(events)) return []
        const withMarkets = events.filter((e) => Array.isArray(e.markets) && e.markets.length > 0)
        if (sortByNew) {
          withMarkets.sort((a, b) => {
            const tA = a.markets[0]?.created_time
            const tB = b.markets[0]?.created_time
            const msA = tA ? new Date(tA).getTime() : 0
            const msB = tB ? new Date(tB).getTime() : 0
            return msB - msA
          })
        } else {
          withMarkets.sort((a, b) => {
            const vA = Number(a.markets[0]?.volume_24h_fp ?? a.markets[0]?.volume_fp ?? 0)
            const vB = Number(b.markets[0]?.volume_24h_fp ?? b.markets[0]?.volume_fp ?? 0)
            return vB - vA
          })
        }
        return adaptEventsToCards(withMarkets)
      })
      .then((list) => {
        if (!cancelled) setCards(list ?? [])
      })
      .catch((err) => {
        if (!cancelled) {
          setCardsError(err?.message || 'Failed to load markets')
          setCards([])
        }
      })
      .finally(() => {
        if (!cancelled) setCardsLoading(false)
      })

    return () => { cancelled = true }
  }, [categoryParamForSeries, effectiveCategory, effectiveTab])

  const sectionTitle = showAll
    ? 'All'
    : (categories.find((c) => c.id === effectiveCategory)?.label ?? FALLBACK_CATEGORY_LABELS[effectiveCategory] ?? effectiveCategory)

  const apiCategories = (categories || [])
    .filter((c) => (c.id ?? '').toLowerCase() !== 'all')
    .map((c) => ({ ...c, href: `/category/${c.id}` }))
  const categoryList = [
    { id: 'all', label: 'All', href: '/category/all' },
    ...apiCategories,
  ]

  return (
    <>
      <Header />
      <main className="main">
        <section className="categories-row">
          <div className="categories-row-inner">
            <TabsBar activeTab={effectiveTab === 'all' ? 'trending' : effectiveTab} onTabChange={setActiveTab} />
            <CategoryBar
              categories={categoryList}
              activeCategory={effectiveCategory}
              onCategoryChange={setActiveCategory}
            />
            <AlphaToggle alphaOn={alphaOn} onToggle={setAlphaOn} />
          </div>
        </section>
        <SubCategoryBar activeSub={activeSub} onSubChange={setActiveSub} />

        <section className="markets-section">
          <div className="markets-inner">
            <h1 className="section-title">{sectionTitle}</h1>
            {cardsError && (
              <p className="markets-error" role="alert">{cardsError}</p>
            )}
            {cardsLoading ? (
              <p className="markets-loading">Loading…</p>
            ) : (
              <div className="market-list">
                {cards.map((card) => (
                  <Link key={card.id} to={`/markets/${card.id}`} className="market-card-link">
                    <MarketCard
                      eventSubtitle={card.eventSubtitle}
                      title={card.title}
                      eventImage={card.eventImage}
                      outcomes={card.outcomes}
                      volume={card.volume}
                      isNew={card.isNew}
                      priceChange={card.priceChange}
                      aiAnalysis={card.aiAnalysis}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
