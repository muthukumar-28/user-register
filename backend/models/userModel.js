const db = require('../db')

const createUser = (data, callback) => {
  const sql = `INSERT INTO users (username, password_hash, full_name, dob, address, country, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`
  db.query(sql, data, callback)
}

const findUserByUsernameOrEmail = (username, email, callback) => {
  const sql = `SELECT * FROM users WHERE username = ? OR email = ?`
  db.query(sql, [username, email], callback)
}

module.exports = { createUser, findUserByUsernameOrEmail }