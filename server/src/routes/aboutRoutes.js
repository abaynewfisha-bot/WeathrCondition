const router = require("express").Router();
const { query } = require("../config/db");

router.get("/", async (req, res, next) => {
  try {
    const result = await query(
      "SELECT app_name, version, description, developer_name, contact_email, website_url FROM app_info LIMIT 1"
    );

    res.json({
      about: result.rows[0] || {
        app_name: "WeatherWorld",
        version: "1.0.0",
        description: "Real-time weather conditions and forecasts.",
        developer_name: "WeatherWorld Development Team",
        contact_email: "support@weatherworld.app",
        website_url: ""
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
