import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function EditFeedback() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetch('https://product-mgmt-server.onrender.com/feedback') // ✅ updated
      .then(res => res.json())
      .then(data => {
        const item = data.find(f => f.id === parseInt(id))
        if (item) setFormData(item)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.title) newErrors.title = "Can't be empty"
    if (!formData.detail) newErrors.detail = "Can't be empty"
    if (Object.keys(newErrors).length) return setErrors(newErrors)

    await fetch(`https://product-mgmt-server.onrender.com/feedback/${id}`, { // ✅ updated
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    navigate('/')
  }

  const handleDelete = async () => {
    await fetch(`https://product-mgmt-server.onrender.com/feedback/${id}`, { // ✅ updated
      method: 'DELETE'
    })
    navigate('/')
  }

  const handleCancel = () => navigate('/')

  if (!formData) return <p>Loading...</p>

  return (
    <form style={{ maxWidth: 600, margin: '2rem auto' }} onSubmit={handleSubmit}>
      <button onClick={() => navigate(-1)} className="go-back-button">← Go Back</button>

      <h1>Edit Feedback</h1>

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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button type="button" onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
          Delete
        </button>
        <div>
          <button type="button" onClick={handleCancel} style={{ marginRight: '10px' }}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </div>
    </form>
  )
}

export default EditFeedback