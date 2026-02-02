import './MarketCard.css'

export default function MarketCard({
  eventSubtitle,
  title,
  eventImage,
  outcomes = [],
  volume,
  isNew,
  priceChange,
  aiAnalysis,
}) {
  return (
    <article className="market-card">
      <div className="market-card-top">
        <div className="market-card-image-wrap">
          {eventImage ? (
            <img src={eventImage} alt="" className="market-card-image" />
          ) : (
            <div className="market-card-image-placeholder" aria-hidden />
          )}
        </div>
        <div className="market-card-header">
          {eventSubtitle && (
            <p className="market-event-subtitle">{eventSubtitle}</p>
          )}
          <h2 className="market-question">{title}</h2>
          {isNew && <span className="market-badge market-badge--new">NEW</span>}
        </div>
      </div>
      <ul className="market-outcomes">
        <li className="market-outcome market-outcome--header">
          <span className="outcome-label">选项</span>
          <span className="outcome-pct">human</span>
          <span className="outcome-ai">AI</span>
          <div className="outcome-buttons outcome-buttons--header" aria-hidden />
        </li>
        {outcomes.map((outcome, i) => (
          <li key={i} className="market-outcome">
            <span className="outcome-label">{outcome.label}</span>
            <span className="outcome-pct">{outcome.pct}%</span>
            <span className="outcome-ai">{outcome.aiProb != null ? `${outcome.aiProb}%` : '—'}</span>
            <div className="outcome-buttons">
              <button type="button" className="btn-outcome btn-outcome--yes">Yes</button>
              <button type="button" className="btn-outcome btn-outcome--no">No</button>
            </div>
          </li>
        ))}
      </ul>
      {priceChange && (
        <p className="market-price-change">
          {priceChange.text}
        </p>
      )}
      <div className="market-card-footer">
        <span className="market-volume">{volume}</span>
        <button type="button" className="market-add-btn" aria-label="Add to watchlist">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      {aiAnalysis && (
        <div className="market-card-ai-analysis">
          <p className="market-card-ai-analysis-label">AI 分析</p>
          <div className="market-card-ai-analysis-text">{aiAnalysis}</div>
        </div>
      )}
    </article>
  )
}
