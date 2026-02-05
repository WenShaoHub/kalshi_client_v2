import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getMarket, getEvent } from '../lib/api'
import { adaptMarketDetail } from '../lib/adapters/marketDetail'
import EventDetailHeader from '../components/EventDetailHeader'
import SummaryProbs from '../components/SummaryProbs'
import ProbabilityChart from '../components/ProbabilityChart'
import ChanceRow from '../components/ChanceRow'
import TradingPanel from '../components/TradingPanel'
import './MarketDetail.css'

export default function MarketDetail() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailError, setDetailError] = useState(null)
  const [selectedCandidateId, setSelectedCandidateId] = useState(null)

  useEffect(() => {
    if (!id) {
      setDetail(null)
      setDetailLoading(false)
      return
    }
    let cancelled = false
    setDetailLoading(true)
    setDetailError(null)
    getMarket(id)
      .then((res) => {
        if (cancelled) return
        if (!res.success || !res.data) {
          setDetail(null)
          setDetailError(res.error?.message || 'Market not found')
          setDetailLoading(false)
          return
        }
        const market = res.data
        const eventTicker = market.event_ticker
        if (!eventTicker) {
          const adapted = adaptMarketDetail(market)
          setDetail(adapted)
          if (adapted?.candidates?.length) setSelectedCandidateId(adapted.candidates[0].id)
          setDetailLoading(false)
          return
        }
        return getEvent(eventTicker, { with_nested_markets: true }).then((eventRes) => {
          if (cancelled) return
          const eventData = eventRes?.success ? eventRes.data : null
          const nestedMarkets = Array.isArray(eventData?.markets) ? eventData.markets : []
          const adapted = adaptMarketDetail(market, {
            event: eventData,
            nestedMarkets,
          })
          setDetail(adapted)
          if (adapted?.candidates?.length) setSelectedCandidateId(adapted.candidates[0].id)
        })
      })
      .then(() => {
        if (!cancelled) setDetailLoading(false)
      })
      .catch((err) => {
        if (!cancelled) {
          setDetailError(err?.message || 'Failed to load market')
          setDetail(null)
          setDetailLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [id])

  if (!id) return <Navigate to="/" replace />
  if (detailLoading) {
    return (
      <>
        <Header />
        <main className="market-detail-main">
          <div className="market-detail-content">
            <p className="market-detail-loading">Loading…</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  if (detailError || !detail) {
    return (
      <>
        <Header />
        <main className="market-detail-main">
          <div className="market-detail-content">
            <p className="market-detail-error" role="alert">{detailError || 'Market not found'}</p>
            <Link to="/" className="market-detail-back">Back to home</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const effectiveSelectedId =
    selectedCandidateId && detail.candidates.some((c) => c.id === selectedCandidateId)
      ? selectedCandidateId
      : detail.candidates[0]?.id ?? null

  return (
    <>
      <Header />
      <main className="market-detail-main">
        <div className="market-detail-content">
          <div className="market-detail-left">
            <EventDetailHeader
              eventImage={detail.eventImage}
              category={detail.category}
              subcategory={detail.subcategory}
              title={detail.title}
            />
            <SummaryProbs candidates={detail.summaryCandidates} />
            <ProbabilityChart
              chartData={detail.chartData}
              volume={detail.volume}
            />
            <section className="chance-section">
              <h2 className="chance-section-title">Chance</h2>
              <ul className="chance-list">
                {detail.candidates.map((c) => (
                  <ChanceRow
                    key={c.id}
                    candidate={c}
                    onSelect={() => setSelectedCandidateId(c.id)}
                  />
                ))}
              </ul>
              <Link to="/category/all" className="more-markets-link">More markets</Link>
            </section>
            {detail.disclaimer && (
              <div className="market-detail-disclaimer">
                <p>{detail.disclaimer}</p>
              </div>
            )}
            {detail.aiAnalysis && (
              <div className="market-detail-ai">
                <p className="market-detail-ai-label">AI Analysis</p>
                <div className="market-detail-ai-text">{detail.aiAnalysis}</div>
              </div>
            )}
          </div>
          <aside className="market-detail-sidebar">
            <TradingPanel
              title={detail.title}
              candidates={detail.candidates}
              selectedCandidateId={effectiveSelectedId}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
