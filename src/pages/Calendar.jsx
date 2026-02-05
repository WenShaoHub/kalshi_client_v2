import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MarketCard from '../components/MarketCard'
import { getEvents } from '../lib/api'
import { adaptEventsToCards } from '../lib/adapters/markets'
import './Calendar.css'

const CALENDAR_EVENTS_LIMIT = 80

export default function Calendar() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const minCloseTs = Math.floor(Date.now() / 1000)
    getEvents({
      min_close_ts: minCloseTs,
      status: 'open',
      with_nested_markets: true,
      limit: CALENDAR_EVENTS_LIMIT,
    })
      .then((res) => {
        if (cancelled) return
        if (!res.success || !Array.isArray(res.data?.events)) {
          setCards([])
          setLoading(false)
          return
        }
        const events = res.data.events
        const withMarkets = events.filter((e) => Array.isArray(e.markets) && e.markets.length > 0)
        withMarkets.sort((a, b) => {
          const tA = a.markets[0]?.close_time ?? ''
          const tB = b.markets[0]?.close_time ?? ''
          return tA.localeCompare(tB)
        })
        setCards(adaptEventsToCards(withMarkets))
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load events')
          setCards([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Header />
      <main className="calendar-main">
        <div className="calendar-inner">
          <h1 className="calendar-title">Live</h1>
          {error && (
            <>
              <p className="calendar-error" role="alert">{error}</p>
              <Link to="/" className="calendar-back-link">Back to home</Link>
            </>
          )}
          {loading ? (
            <p className="calendar-loading">Loading…</p>
          ) : cards.length === 0 ? (
            <p className="calendar-empty">暂无即将到期的事件</p>
          ) : (
            <div className="calendar-list market-list">
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
          {!loading && !error && cards.length > 0 && (
            <Link to="/category/all" className="calendar-back-link">All markets</Link>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
