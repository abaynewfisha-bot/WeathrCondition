const { query } = require("../config/db");

async function upsert(city) {
  const result = await query(
    `INSERT INTO cities
      (name, country, latitude, longitude, timezone)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (name, country)
     DO UPDATE SET
       latitude = EXCLUDED.latitude,
       longitude = EXCLUDED.longitude,
       timezone = EXCLUDED.timezone
     RETURNING *`,
    [
      city.name,
      city.country || "",
      city.latitude,
      city.longitude,
      city.timezone || "auto"
    ]
  );

  return result.rows[0];
}

async function search(searchTerm) {
  const result = await query(
    `SELECT *
     FROM cities
     WHERE name ILIKE $1 OR country ILIKE $1
     ORDER BY name
     LIMIT 20`,
    [`%${searchTerm}%`]
  );

  return result.rows;
}

async function list() {
  const result = await query(
    "SELECT * FROM cities ORDER BY name"
  );

  return result.rows;
}

module.exports = { upsert, search, list };
