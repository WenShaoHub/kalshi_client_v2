import { useState } from 'react'
import './TradingPanel.css'

export default function TradingPanel({ title, candidates = [], selectedCandidateId }) {
  const selected = candidates.find((c) => c.id === selectedCandidateId) || candidates[0]
  const [tradeType, setTradeType] = useState('buy')
  const [amount, setAmount] = useState('')

  return (
    <aside className="trading-panel">
      <h2 className="trading-panel-title">{title}</h2>
      {selected && (
        <div className="trading-panel-selected">
          <span className="trading-panel-selected-label">
            Buy Yes · {selected.name}
          </span>
          <div className="trading-panel-selected-avatar-wrap">
            {selected.avatar ? (
              <img src={selected.avatar} alt="" className="trading-panel-selected-avatar" />
            ) : (
              <div className="trading-panel-selected-avatar-placeholder" aria-hidden />
            )}
          </div>
        </div>
      )}
      <div className="trading-panel-tabs">
        <button
          type="button"
          className={`trading-panel-tab ${tradeType === 'buy' ? 'trading-panel-tab--active' : ''}`}
          onClick={() => setTradeType('buy')}
        >
          Buy
        </button>
        <button
          type="button"
          className={`trading-panel-tab ${tradeType === 'sell' ? 'trading-panel-tab--active' : ''}`}
          onClick={() => setTradeType('sell')}
        >
          Sell
        </button>
      </div>
      <div className="trading-panel-unit">
        <select className="trading-panel-select" aria-label="Unit">
          <option value="dollars">Dollars</option>
        </select>
      </div>
      <div className="trading-panel-buttons">
        <button type="button" className="trading-panel-btn trading-panel-btn--yes">
          Yes {selected?.yesCents != null ? `${selected.yesCents}¢` : ''}
        </button>
        <button type="button" className="trading-panel-btn trading-panel-btn--no">
          No {selected?.noCents != null ? `${selected.noCents}¢` : ''}
        </button>
      </div>
      <div className="trading-panel-amount">
        <label className="trading-panel-amount-label">Amount</label>
        <input
          type="text"
          className="trading-panel-amount-input"
          placeholder="$0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Amount"
        />
        <p className="trading-panel-amount-hint">Earn 3.25% Interest</p>
      </div>
      <button type="button" className="trading-panel-cta">
        Sign up to trade
      </button>
    </aside>
  )
}
