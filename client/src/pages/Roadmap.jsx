import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Roadmap() {
  const [feedback, setFeedback] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/feedback')
      .then(res => res.json())
      .then(data => setFeedback(data))
  }, [])

  const groupByStatus = (status) =>
    feedback.filter(item => item.status === status)

  const renderGroup = (title, status) => {
    const items = groupByStatus(status)
    return (
      <div className="roadmap-column">
        <h2>{title} ({items.length})</h2>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/feedback/${item.id}`)}
            className="feedback-card"
          >
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <span className="category-badge">{item.category}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="roadmap-page" style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} className="go-back-button">← Go Back</button>

      <h1>Roadmap</h1>

      <div className="roadmap-grid" style={{ display: 'flex', gap: '2rem' }}>
        {renderGroup('Planned', 'Planned')}
        {renderGroup('In-Progress', 'In-Progress')}
        {renderGroup('Live', 'Live')}
      </div>
    </div>
  )
}

export default Roadmap