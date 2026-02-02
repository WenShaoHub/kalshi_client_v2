import './SubCategoryBar.css'

const POLITICS_SUBS = [
  { id: 'all', label: 'All' },
  { id: 'us-elections', label: 'US Elections' },
  { id: 'primaries', label: 'Primaries' },
  { id: 'trump', label: 'Trump' },
  { id: 'foreign', label: 'Foreign Elections' },
  { id: 'international', label: 'International' },
  { id: 'house', label: 'House' },
  { id: 'congress', label: 'Congress' },
  { id: 'scotus', label: 'SCOTUS & courts' },
  { id: 'local', label: 'Local' },
  { id: 'recurring', label: 'Recurring' },
  { id: 'sort', label: 'Sort / Filter' },
]

export default function SubCategoryBar({ activeSub = 'all', onSubChange }) {
  return (
    <section className="sub-category-bar">
      <div className="sub-category-bar-inner">
        {POLITICS_SUBS.map((sub) => (
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
