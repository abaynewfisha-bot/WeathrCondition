const { query } = require("../config/db");

async function listForUser(userId) {
  const result = await query(
    `SELECT
       f.id,
       f.created_at,
       c.id AS city_id,
       c.name AS city_name,
       c.country,
       c.latitude,
       c.longitude
     FROM favorites f
     JOIN cities c ON c.id = f.city_id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return result.rows;
}

async function add(userId, cityId) {
  const result = await query(
    `INSERT INTO favorites (user_id, city_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, city_id)
     DO UPDATE SET city_id = EXCLUDED.city_id
     RETURNING *`,
    [userId, cityId]
  );

  return result.rows[0];
}

async function remove(favoriteId, userId) {
  const result = await query(
    `DELETE FROM favorites
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [favoriteId, userId]
  );

  return result.rows[0] || null;
}

module.exports = { listForUser, add, remove };
