import './ChanceRow.css'

export default function ChanceRow({ candidate, onSelect }) {
  const { name, avatar, pct, change, changeDir, yesCents, noCents } = candidate

  return (
    <li className="chance-row">
      <button type="button" className="chance-row-inner" onClick={() => onSelect?.(candidate)}>
        <div className="chance-row-avatar-wrap">
          {avatar ? (
            <img src={avatar} alt="" className="chance-row-avatar" />
          ) : (
            <div className="chance-row-avatar-placeholder" aria-hidden />
          )}
        </div>
        <span className="chance-row-name">{name}</span>
        <span className="chance-row-pct">{pct}{typeof pct === 'number' ? '%' : ''}</span>
        {change != null && changeDir && (
          <span className={`chance-row-change chance-row-change--${changeDir}`}>
            <span className="material-symbols-outlined chance-row-change-icon">
              {changeDir === 'up' ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
            {change}
          </span>
        )}
        <div className="chance-row-buttons">
          <button type="button" className="chance-row-btn chance-row-btn--yes" onClick={(e) => e.stopPropagation()}>
            Yes {yesCents != null ? `${yesCents}¢` : ''}
          </button>
          <button type="button" className="chance-row-btn chance-row-btn--no" onClick={(e) => e.stopPropagation()}>
            No {noCents != null ? `${noCents}¢` : ''}
          </button>
        </div>
      </button>
    </li>
  )
}
