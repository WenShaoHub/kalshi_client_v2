import './CategoryBar.css'

const CATEGORIES = [
  { id: 'politics', label: 'Politics', href: '/category/politics' },
  { id: 'sports', label: 'Sports', href: '/sports/all-sports' },
  { id: 'culture', label: 'Culture', href: '/category/culture' },
  { id: 'crypto', label: 'Crypto', href: '/category/crypto' },
  { id: 'climate', label: 'Climate', href: '/category/climate' },
  { id: 'economics', label: 'Economics', href: '/category/economics' },
  { id: 'mentions', label: 'Mentions', href: '/category/mentions' },
  { id: 'companies', label: 'Companies', href: '/category/companies' },
  { id: 'financials', label: 'Financials', href: '/category/financials' },
  { id: 'science', label: 'Tech & Science', href: '/category/science' },
]

export default function CategoryBar({ activeCategory = 'politics', onCategoryChange }) {
  return (
    <section className="category-bar">
      <div className="category-bar-inner">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={cat.href}
            className={`category-link ${activeCategory === cat.id ? 'category-link--active' : ''}`}
            onClick={(e) => {
              if (onCategoryChange) {
                e.preventDefault()
                onCategoryChange(cat.id)
              }
            }}
          >
            {cat.label}
          </a>
        ))}
      </div>
    </section>
  )
}
