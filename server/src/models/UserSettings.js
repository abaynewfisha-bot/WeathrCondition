const { query } = require("../config/db");

async function getForUser(userId) {
  const result = await query(
    `INSERT INTO user_settings (user_id)
     VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );

  const settings = await query(
    `SELECT temperature_unit, theme, language, notifications_enabled,
            weather_alerts, updated_at
     FROM user_settings
     WHERE user_id = $1`,
    [userId]
  );

  return settings.rows[0] || null;
}

async function updateForUser(userId, settings) {
  const result = await query(
    `INSERT INTO user_settings
       (user_id, temperature_unit, theme, language, notifications_enabled, weather_alerts)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET
       temperature_unit = EXCLUDED.temperature_unit,
       theme = EXCLUDED.theme,
       language = EXCLUDED.language,
       notifications_enabled = EXCLUDED.notifications_enabled,
       weather_alerts = EXCLUDED.weather_alerts,
       updated_at = CURRENT_TIMESTAMP
     RETURNING temperature_unit, theme, language,
               notifications_enabled, weather_alerts, updated_at`,
    [
      userId,
      settings.temperature_unit,
      settings.theme,
      settings.language,
      settings.notifications_enabled,
      settings.weather_alerts
    ]
  );

  return result.rows[0];
}

module.exports = { getForUser, updateForUser };
