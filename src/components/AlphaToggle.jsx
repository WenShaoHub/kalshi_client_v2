import './AlphaToggle.css'

export default function AlphaToggle({ alphaOn = false, onToggle }) {
  return (
    <div className="alpha-toggle">
      <span className="alpha-label">Alpha</span>
      <button
        type="button"
        className={`alpha-switch ${alphaOn ? 'alpha-switch--on' : ''}`}
        onClick={() => onToggle?.(!alphaOn)}
        aria-pressed={alphaOn}
        aria-label="Toggle Alpha"
      >
        <span className="alpha-switch-track" />
        <span className="alpha-switch-thumb" />
      </button>
    </div>
  )
}
