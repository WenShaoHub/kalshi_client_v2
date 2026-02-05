import './TabsBar.css'

const TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
]

export default function TabsBar({ activeTab = 'trending', onTabChange }) {
  return (
    <section className="tabs-bar">
      <div className="tabs-inner">
        <div className="tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onTabChange?.(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
