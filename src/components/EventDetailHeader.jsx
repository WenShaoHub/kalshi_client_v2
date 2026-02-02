import './EventDetailHeader.css'

export default function EventDetailHeader({ eventImage, category, subcategory, title }) {
  return (
    <header className="event-detail-header">
      <div className="event-detail-image-wrap">
        {eventImage ? (
          <img src={eventImage} alt="" className="event-detail-image" />
        ) : (
          <div className="event-detail-image-placeholder" aria-hidden />
        )}
      </div>
      <div className="event-detail-meta">
        <p className="event-detail-category">
          {category}{subcategory ? ` · ${subcategory}` : ''}
        </p>
        <h1 className="event-detail-title">{title}</h1>
        <div className="event-detail-actions">
          <button type="button" className="event-detail-action-btn" aria-label="Share">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button type="button" className="event-detail-action-btn" aria-label="Download">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
      </div>
    </header>
  )
}

