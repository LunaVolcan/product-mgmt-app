const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config({ path: '../.env' })

const app = express()
const PORT = process.env.PORT || 3000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

app.use(cors())
app.use(express.json())

// --- Helper Functions ---
const getAllFeedback = async () =>
  await pool.query('SELECT * FROM feedback')

const createFeedback = async ({ title, category, detail }) =>
  await pool.query(
    'INSERT INTO feedback (title, category, detail) VALUES ($1, $2, $3) RETURNING *',
    [title, category, detail]
  )

const updateFeedback = async (id, { title, category, detail, status }) =>
  await pool.query(
    `UPDATE feedback 
     SET title = $1, category = $2, detail = $3, status = $4 
     WHERE id = $5 RETURNING *`,
    [title, category, detail, status, id]
  )

const deleteFeedback = async (id) =>
  await pool.query('DELETE FROM feedback WHERE id = $1', [id])

const getCommentsByFeedbackId = async (feedbackId) =>
  await pool.query(
    'SELECT * FROM comments WHERE feedback_id = $1 ORDER BY created_at ASC',
    [feedbackId]
  )

const postComment = async ({ feedback_id, author_name, author_username, content }) =>
  await pool.query(
    `INSERT INTO comments (feedback_id, author_name, author_username, content) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [feedback_id, author_name, author_username, content]
  )

const upvoteFeedback = async (id) =>
  await pool.query(
    `UPDATE feedback
     SET upvotes = COALESCE(upvotes, 0) + 1
     WHERE id = $1
     RETURNING *`,
    [id]
  )

// --- Routes ---
app.get('/', (req, res) => {
  res.send('API is running 🎉')
})

app.get('/feedback', async (req, res) => {
  try {
    const result = await getAllFeedback()
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/feedback', async (req, res) => {
  try {
    const result = await createFeedback(req.body)
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not add feedback' })
  }
})

app.put('/feedback/:id', async (req, res) => {
  try {
    const result = await updateFeedback(req.params.id, req.body)
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error updating feedback' })
  }
})

app.delete('/feedback/:id', async (req, res) => {
  try {
    await deleteFeedback(req.params.id)
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete feedback' })
  }
})

app.get('/comments/:feedbackId', async (req, res) => {
  try {
    const result = await getCommentsByFeedbackId(req.params.feedbackId)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

app.post('/comments', async (req, res) => {
  try {
    const result = await postComment(req.body)
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to post comment' })
  }
})

app.patch('/feedback/:id/upvote', async (req, res) => {
  try {
    const result = await upvoteFeedback(req.params.id)
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error upvoting feedback:', err)
    res.status(500).json({ error: 'Failed to upvote feedback' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})