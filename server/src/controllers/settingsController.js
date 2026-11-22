const UserSettings = require("../models/UserSettings");

const units = new Set(["celsius", "fahrenheit"]);
const themes = new Set(["light", "dark", "system"]);

exports.get = async (req, res, next) => {
  try {
    res.json({ settings: await UserSettings.getForUser(req.user.id) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const temperatureUnit = String(req.body.temperature_unit || "celsius").toLowerCase();
    const theme = String(req.body.theme || "system").toLowerCase();

    if (!units.has(temperatureUnit) || !themes.has(theme)) {
      return res.status(400).json({
        error: "Invalid temperature unit or theme."
      });
    }

    const settings = await UserSettings.updateForUser(req.user.id, {
      temperature_unit: temperatureUnit,
      theme,
      language: String(req.body.language || "en").slice(0, 10),
      notifications_enabled: Boolean(req.body.notifications_enabled),
      weather_alerts: Boolean(req.body.weather_alerts)
    });

    res.json({ settings });
  } catch (error) {
    next(error);
  }
};
