const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { errors } = require('celebrate') 
const userRoutes = require('./routes/users')
require('./initDB')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/users', userRoutes)

app.use(errors())

app.use((err, req, res, next) => {
  if (err.joi) {
    return res.status(400).json({
      error: err.joi.message.replace(/"/g, ''),
    })
  }

  console.error('Unhandled Error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
