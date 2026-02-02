import { useState } from 'react'
import './ProbabilityChart.css'

const COLOR_MAP = {
  green: 'var(--kalshi-palette-green-x10)',
  blue: 'var(--kalshi-palette-yes-x10)',
  black: 'var(--kalshi-palette-text-x10)',
}

const RANGES = ['1D', '1W', '1M', 'ALL']

export default function ProbabilityChart({ chartData, volume }) {
  const [range, setRange] = useState('ALL')
  const { dates = [], series = [] } = chartData || {}
  const width = 600
  const height = 240
  const padding = { top: 20, right: 40, bottom: 32, left: 44 }
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  const n = dates.length
  const xScale = (i) => padding.left + (i / Math.max(n - 1, 1)) * innerWidth
  const yScale = (v) => padding.top + innerHeight - (Number(v) / 100) * innerHeight

  return (
    <section className="probability-chart">
      <div className="probability-chart-header">
        <h2 className="probability-chart-title">Probability over time</h2>
        <div className="probability-chart-ranges">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`probability-chart-range ${range === r ? 'probability-chart-range--active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
          <button type="button" className="probability-chart-filter" aria-label="Filter">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>
      <div className="probability-chart-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="probability-chart-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            {series.map((s, idx) => (
              <linearGradient key={s.candidateId} id={`line-gradient-${idx}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={COLOR_MAP[s.colorKey] || COLOR_MAP.black} stopOpacity="0.3" />
                <stop offset="100%" stopColor={COLOR_MAP[s.colorKey] || COLOR_MAP.black} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {/* Y grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <line
              key={v}
              x1={padding.left}
              x2={width - padding.right}
              y1={yScale(v)}
              y2={yScale(v)}
              className="probability-chart-grid"
            />
          ))}
          {/* Y labels */}
          {[0, 25, 50, 75, 100].map((v) => (
            <text key={v} x={padding.left - 8} y={yScale(v) + 4} textAnchor="end" className="probability-chart-axis-label">
              {v}%
            </text>
          ))}
          {/* X labels */}
          {dates.map((d, i) => (
            <text key={d} x={xScale(i)} y={height - 8} textAnchor="middle" className="probability-chart-axis-label probability-chart-axis-label--x">
              {d}
            </text>
          ))}
          {/* Vertical line at Jul 23, 2025 (index ~3) */}
          {n >= 4 && (
            <line
              x1={xScale(3)}
              x2={xScale(3)}
              y1={padding.top}
              y2={height - padding.bottom}
              className="probability-chart-vline"
              strokeDasharray="4 4"
            />
          )}
          {/* Lines */}
          {series.map((s, idx) => {
            const points = s.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')
            return (
              <g key={s.candidateId}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={COLOR_MAP[s.colorKey] || COLOR_MAP.black}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="probability-chart-line"
                />
              </g>
            )
          })}
        </svg>
      </div>
      <div className="probability-chart-footer">
        <span className="probability-chart-vol">{volume} vol</span>
      </div>
    </section>
  )
}
