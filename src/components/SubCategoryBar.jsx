import './SubCategoryBar.css'

/* 话题/标签：For you 为首项，其余为热门话题 */
const TOPIC_PILLS = [
  { id: 'for-you', label: 'For you' },
  { id: 'grammys', label: 'The Grammys' },
  { id: 'shutdown', label: 'Shutdown' },
  { id: 'pro-football', label: 'Pro Football Championship' },
  { id: 'scotus', label: 'SCOTUS' },
  { id: 'iran', label: 'Iran' },
  { id: 'oscars', label: 'The Oscars' },
  { id: 'greenland', label: 'Greenland' },
  { id: 'harry-styles', label: 'Harry Styles' },
  { id: 'mayor-mamdani', label: 'Mayor Mamdani' },
  { id: 'nhl', label: 'NHL' },
]

export default function SubCategoryBar({ activeSub = 'for-you', onSubChange }) {
  return (
    <section className="sub-category-bar">
      <div className="sub-category-bar-inner">
        {TOPIC_PILLS.map((sub) => (
          <button
            key={sub.id}
            type="button"
            className={`sub-pill ${activeSub === sub.id ? 'sub-pill--active' : ''}`}
            onClick={() => onSubChange?.(sub.id)}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </section>
  )
}
