import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [feedback, setFeedback] = useState([])
  const [filter, setFilter] = useState('All')
  const [sortOption, setSortOption] = useState('Most Upvotes')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/feedback')
      .then(res => res.json())
      .then(data => setFeedback(data))
  }, [])

  const filteredFeedback = filter === 'All'
    ? [...feedback]
    : feedback.filter(item => item.category === filter)

  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    const upA = a.upvotes || 0
    const upB = b.upvotes || 0
    const comA = a.comment_count || 0
    const comB = b.comment_count || 0

    switch (sortOption) {
      case 'Most Upvotes': return upB - upA
      case 'Least Upvotes': return upA - upB
      case 'Most Comments': return comB - comA
      case 'Least Comments': return comA - comB
      default: return 0
    }
  })

  const getStatusCount = (status) =>
    feedback.filter(item => item.status === status).length

  const categories = ['All', 'UI', 'UX', 'Feature', 'Enhancement', 'Bug']

  return (
    <div className="home-container">
      {/* SIDEBAR (desktop/tablet only) */}
      <aside className="sidebar">
        <div className="company-card">
          <h2>My Company</h2>
          <small>Feedback Board</small>
        </div>

        <div className="filter-box">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-button ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="roadmap-preview">
          <div className="roadmap-header">
            <strong>Roadmap</strong>
            <button
              onClick={() => navigate('/roadmap')}
              className="view-roadmap"
            >
              View
            </button>
          </div>
          <div>Planned: {getStatusCount('Planned')}</div>
          <div>In-Progress: {getStatusCount('In-Progress')}</div>
          <div>Live: {getStatusCount('Live')}</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="suggestions-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <h2>{sortedFeedback.length} Suggestions</h2>

            {/* SORTING DROPDOWN */}
            <div className="sort-container">
              <span>Sort by:</span>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="sort-button">
                {sortOption} ⌄
              </button>

              {dropdownOpen && (
                <ul className="sort-dropdown">
                  {['Most Upvotes', 'Least Upvotes', 'Most Comments', 'Least Comments'].map(option => (
                    <li
                      key={option}
                      onClick={() => {
                        setSortOption(option)
                        setDropdownOpen(false)
                      }}
                      className={sortOption === option ? 'selected' : ''}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ADD FEEDBACK + HAMBURGER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/new-feedback')}
              className="add-feedback-button"
            >
              + Add Feedback
            </button>
            <button
              className="hamburger"
              onClick={() => setMobileMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* FEEDBACK LIST */}
        {sortedFeedback.length === 0 ? (
          <div className="empty-state">
            <h3>No Feedback Yet</h3>
            <p>Be the first to add a suggestion!</p>
          </div>
        ) : (
          sortedFeedback.map(item => (
            <div key={item.id} className="feedback-card">
              <div className="card-header">
                <button
                  className="upvote-button"
                  onClick={async () => {
                    const res = await fetch(`http://localhost:3000/feedback/${item.id}/upvote`, {
                      method: 'PATCH'
                    })
                    const updated = await res.json()
                    setFeedback(prev =>
                      prev.map(f => (f.id === item.id ? updated : f))
                    )
                  }}
                >
                  🔼 {item.upvotes || 0}
                </button>

                <div
                  className="card-content"
                  onClick={() => navigate(`/feedback/${item.id}`)}
                >
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <span className="category-badge">{item.category}</span>
                </div>

                <div className="card-comments">
                  💬 {item.comment_count || 0}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar-overlay">
          <div className="mobile-sidebar">
            <div className="mobile-header">
              <h2>My Company</h2>
              <p>Feedback Board</p>
              <button className="close-menu" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            <div className="filter-box">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilter(cat)
                    setMobileMenuOpen(false)
                  }}
                  className={`filter-button ${filter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="roadmap-preview">
              <div className="roadmap-header">
                <strong>Roadmap</strong>
                <button onClick={() => {
                  navigate('/roadmap')
                  setMobileMenuOpen(false)
                }} className="view-roadmap">
                  View
                </button>
              </div>
              <div>Planned: {getStatusCount('Planned')}</div>
              <div>In-Progress: {getStatusCount('In-Progress')}</div>
              <div>Live: {getStatusCount('Live')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home