import { Link } from 'react-router-dom'
import './CategoryBar.css'

const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'All', href: '/category/all' },
  { id: 'politics', label: 'Politics', href: '/category/politics' },
  { id: 'sports', label: 'Sports', href: '/category/sports' },
  { id: 'culture', label: 'Culture', href: '/category/culture' },
  { id: 'crypto', label: 'Crypto', href: '/category/crypto' },
  { id: 'climate', label: 'Climate', href: '/category/climate' },
  { id: 'economics', label: 'Economics', href: '/category/economics' },
  { id: 'mentions', label: 'Mentions', href: '/category/mentions' },
  { id: 'companies', label: 'Companies', href: '/category/companies' },
  { id: 'financials', label: 'Financials', href: '/category/financials' },
  { id: 'science', label: 'Tech & Science', href: '/category/science' },
]

export default function CategoryBar({ categories = DEFAULT_CATEGORIES, activeCategory = 'politics', onCategoryChange }) {
  const list = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES
  return (
    <section className="category-bar">
      <div className="category-bar-inner">
        {list.map((cat) => (
          <Link
            key={cat.id}
            to={cat.href ?? `/category/${cat.id}`}
            className={`category-link ${activeCategory === cat.id ? 'category-link--active' : ''}`}
            onClick={() => onCategoryChange?.(cat.id)}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
