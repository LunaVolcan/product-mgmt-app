import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NewFeedback() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    category: 'Feature',
    status: 'Suggestion',
    detail: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.title) newErrors.title = "Can't be empty"
    if (!formData.detail) newErrors.detail = "Can't be empty"
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    await fetch('https://your-render-backend.onrender.com/feedback', { // 👈 change this line only
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    navigate('/')
  }

  const handleCancel = () => navigate('/')

  return (
    <form style={{ maxWidth: 600, margin: '2rem auto' }} onSubmit={handleSubmit}>
      <button onClick={() => navigate(-1)} className="go-back-button">← Go Back</button>

      <h1>Create New Feedback</h1>

      <label>Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}

      <label>Category</label>
      <select name="category" value={formData.category} onChange={handleChange}>
        {['Feature', 'UI', 'UX', 'Enhancement', 'Bug'].map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <label>Status</label>
      <select name="status" value={formData.status} onChange={handleChange}>
        {['Suggestion', 'Planned', 'In-Progress', 'Live'].map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <label>Detail</label>
      <textarea
        name="detail"
        value={formData.detail}
        onChange={handleChange}
      />
      {errors.detail && <p style={{ color: 'red' }}>{errors.detail}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button type="button" onClick={handleCancel} style={{ marginRight: '10px' }}>
          Cancel
        </button>
        <button type="submit">Add Feedback</button>
      </div>
    </form>
  )
}

export default NewFeedback