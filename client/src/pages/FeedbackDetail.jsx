import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/feedback')
      const allFeedback = await res.json()
      const match = allFeedback.find(item => item.id === parseInt(id))
      setFeedback(match)

      const commentsRes = await fetch(`http://localhost:3000/comments/${id}`)
      const commentsData = await commentsRes.json()
      setComments(commentsData)

      setLoading(false)
    }

    fetchData()
  }, [id])

  const postComment = async () => {
    if (!commentText.trim()) return

    const res = await fetch('http://localhost:3000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedback_id: parseInt(id),
        author_name: 'Guest',
        author_username: null,
        content: commentText
      })
    })

    const newComment = await res.json()
    setComments(prev => [...prev, newComment])
    setCommentText('')
  }

  if (loading || !feedback) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <button onClick={() => navigate(-1)} className="go-back-button">← Go Back</button>

      <button
        onClick={() => navigate(`/edit-feedback/${id}`)}
        style={{ float: 'right' }}
      >
        Edit Feedback
      </button>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>{feedback.title}</h2>
        <p>{feedback.detail}</p>
        <span style={{ background: '#eee', padding: '0.25rem 0.5rem', borderRadius: '5px' }}>
          {feedback.category}
        </span>
      </div>

      <h3 style={{ marginTop: '2rem' }}>{comments.length} Comments</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((c) => (
          <li key={c.id} style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}>
            <strong>{c.author_name}</strong>
            <p>{c.content}</p>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <h4>Add Comment</h4>
        <textarea
          rows="4"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type your comment here..."
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <small>{250 - commentText.length} Characters left</small>
          <button onClick={postComment}>Post Comment</button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackDetail