const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config({ path: '../.env' })
console.log('Database URL:', process.env.DATABASE_URL)

const app = express()
const PORT = process.env.PORT || 3000

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.send('API is running 🎉')
})

// Get all feedback
app.get('/feedback', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add feedback
app.post('/feedback', async (req, res) => {
  const { title, category, detail } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO feedback (title, category, detail) VALUES ($1, $2, $3) RETURNING *',
      [title, category, detail]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not add feedback' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.put('/feedback/:id', async (req, res) => {
    const { id } = req.params
    const { title, category, detail, status } = req.body
  
    try {
      const result = await pool.query(
        `UPDATE feedback 
         SET title = $1, category = $2, detail = $3, status = $4 
         WHERE id = $5 RETURNING *`,
        [title, category, detail, status, id]
      )
      res.json(result.rows[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error updating feedback' })
    }
  })

  app.delete('/feedback/:id', async (req, res) => {
    const { id } = req.params
    try {
      await pool.query('DELETE FROM feedback WHERE id = $1', [id])
      res.sendStatus(204) 
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to delete feedback' })
    }
  })

  app.get('/comments/:feedbackId', async (req, res) => {
    const { feedbackId } = req.params
    try {
      const result = await pool.query(
        'SELECT * FROM comments WHERE feedback_id = $1 ORDER BY created_at ASC',
        [feedbackId]
      )
      res.json(result.rows)
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch comments' })
    }
  })

  // Post a new comment
app.post('/comments', async (req, res) => {
    const { feedback_id, author_name, author_username, content } = req.body
    try {
      const result = await pool.query(
        `INSERT INTO comments (feedback_id, author_name, author_username, content) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [feedback_id, author_name, author_username, content]
      )
      res.json(result.rows[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to post comment' })
    }
  })

  app.patch('/feedback/:id/upvote', async (req, res) => {
    const { id } = req.params
  
    try {
      const result = await pool.query(
        `UPDATE feedback
         SET upvotes = COALESCE(upvotes, 0) + 1
         WHERE id = $1
         RETURNING *`,
        [id]
      )
  
      res.json(result.rows[0])
    } catch (err) {
      console.error('Error upvoting feedback:', err)
      res.status(500).json({ error: 'Failed to upvote feedback' })
    }
  })