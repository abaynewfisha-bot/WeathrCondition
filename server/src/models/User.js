const { query } = require("../config/db");

async function findByEmail(email) {
  const result = await query(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  return result.rows[0] || null;
}

async function create(user) {
  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [user.name, user.email.toLowerCase(), user.passwordHash]
  );

  return result.rows[0];
}

module.exports = { findByEmail, create };
