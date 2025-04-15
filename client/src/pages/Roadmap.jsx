import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Roadmap() {
  const [feedback, setFeedback] = useState([])
  const [activeTab, setActiveTab] = useState('In-Progress')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://product-mgmt-server.onrender.com/feedback') // ✅ updated URL
      .then(res => res.json())
      .then(data => setFeedback(data))
  }, [])

  const tabs = ['Planned', 'In-Progress', 'Live']

  const filteredFeedback = feedback.filter(item => item.status === activeTab)

  const getStatusCount = (status) =>
    feedback.filter(item => item.status === status).length

  const getBorderColor = (status) => {
    switch (status) {
      case 'Planned':
        return '#f49f85'
      case 'In-Progress':
        return '#ad1fea'
      case 'Live':
        return '#62bcfa'
      default:
        return '#ccc'
    }
  }

  const getDotColor = (status) => {
    switch (status) {
      case 'Planned':
        return '#f49f85'
      case 'In-Progress':
        return '#ad1fea'
      case 'Live':
        return '#62bcfa'
      default:
        return '#ccc'
    }
  }

  return (
    <div className="roadmap-container">
      <header className="roadmap-header">
        <button className="go-back" onClick={() => navigate(-1)}>← Go Back</button>
        <h2>Roadmap</h2>
        <button
          onClick={() => navigate('/new-feedback')}
          className="add-feedback-button"
        >
          + Add Feedback
        </button>
      </header>

      <nav className="roadmap-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab} ({getStatusCount(tab)})
          </button>
        ))}
      </nav>

      <section className="roadmap-column">
        <h3>{activeTab} ({filteredFeedback.length})</h3>
        <p className="roadmap-description">
          {activeTab === 'Planned' && 'Ideas prioritized for research'}
          {activeTab === 'In-Progress' && 'Features currently being developed'}
          {activeTab === 'Live' && 'Released features'}
        </p>

        {filteredFeedback.map(item => (
          <div
            key={item.id}
            className="roadmap-card"
            style={{ borderTop: `6px solid ${getBorderColor(item.status)}` }}
          >
            <div className="status-label">
              <span
                className="status-dot"
                style={{ background: getDotColor(item.status) }}
              ></span>
              {item.status}
            </div>
            <h4>{item.title}</h4>
            <p>{item.detail}</p>
            <span className="category-badge">{item.category}</span>
            <div className="card-footer">
              <div className="upvote-button">🔼 {item.upvotes || 0}</div>
              <div className="card-comments">💬 {item.comment_count || 0}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Roadmap