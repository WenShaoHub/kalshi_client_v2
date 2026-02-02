import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getMarketDetail } from '../lib/mockMarketDetail'
import EventDetailHeader from '../components/EventDetailHeader'
import SummaryProbs from '../components/SummaryProbs'
import ProbabilityChart from '../components/ProbabilityChart'
import ChanceRow from '../components/ChanceRow'
import TradingPanel from '../components/TradingPanel'
import './MarketDetail.css'

export default function MarketDetail() {
  const { id } = useParams()
  const detail = getMarketDetail(id)
  const [selectedCandidateId, setSelectedCandidateId] = useState(detail?.candidates?.[0]?.id ?? null)
  useEffect(() => {
    const d = getMarketDetail(id)
    if (d?.candidates?.length) setSelectedCandidateId(d.candidates[0].id)
  }, [id])
  if (!detail) return <Navigate to="/" replace />
  const effectiveSelectedId = selectedCandidateId && detail.candidates.some((c) => c.id === selectedCandidateId)
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
              <a href="/category/all" className="more-markets-link">More markets</a>
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
