import './SummaryProbs.css'

const COLOR_MAP = {
  green: 'var(--kalshi-palette-green-x10)',
  blue: 'var(--kalshi-palette-yes-x10)',
  black: 'var(--kalshi-palette-text-x10)',
}

export default function SummaryProbs({ candidates = [] }) {
  return (
    <div className="summary-probs">
      {candidates.map((c) => (
        <span key={c.name} className="summary-prob-item">
          <span
            className="summary-prob-dot"
            style={{ background: COLOR_MAP[c.colorKey] || COLOR_MAP.black }}
            aria-hidden
          />
          <span className="summary-prob-name">{c.name}</span>
          <span className="summary-prob-pct">
            {c.pct != null ? `${c.pct}%` : '—%'}
          </span>
        </span>
      ))}
    </div>
  )
}
