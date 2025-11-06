const bcrypt = require('bcrypt')
const { createUser, findUserByUsernameOrEmail } = require('../models/userModel')

const registerUser = async (req, res) => {
  try {
    const { username, password, full_name, dob, address, country, email, phone } = req.body

    findUserByUsernameOrEmail(username, email, async (err, results) => {
      if (err) {
        console.error('Database error:', err)
        return res.status(500).json({ error: 'Database error' })
      }

      if (results && results.length > 0) {
        const duplicate = results[0]

        if (duplicate.username === username && duplicate.email === email) {
          return res.status(409).json({ error: 'Username and email already exist' })
        } else if (duplicate.username === username) {
          return res.status(409).json({ error: 'Username already exists' })
        } else {
          return res.status(409).json({ error: 'Email already exists' })
        }
      }

      // 2️⃣ Hash password
      const hash = await bcrypt.hash(password, 10)

      // 3️⃣ Create new user
      createUser([username, hash, full_name, dob, address, country, email, phone], (err) => {
        if (err) {
          console.error('User creation error:', err)
          return res.status(400).json({ error: 'Failed to create user' })
        }
        res.status(201).json({ message: 'User created successfully' })
      })
    })
  } catch (error) {
    console.error('Internal server error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { registerUser }
