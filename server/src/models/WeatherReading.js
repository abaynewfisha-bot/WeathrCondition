const { query } = require("../config/db");

async function latest(cityId) {
  const result = await query(
    `SELECT payload, fetched_at
     FROM weather_readings
     WHERE city_id = $1
     ORDER BY fetched_at DESC
     LIMIT 1`,
    [cityId]
  );

  return result.rows[0] || null;
}

async function save(cityId, payload) {
  return query(
    `INSERT INTO weather_readings (city_id, payload, fetched_at)
     VALUES ($1, $2, NOW())`,
    [cityId, JSON.stringify(payload)]
  );
}

module.exports = { latest, save };
