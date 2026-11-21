const cache = require("../services/cacheService");
const provider = require("../services/openWeatherService");

exports.get = async (req, res, next) => {
  try {
    const city = req.cityName;
    const weather = await cache.getWeather(city);

    res.json(weather);
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const query = String(req.query.q || "").trim();

    if (query.length < 2) {
      return res.json({ results: [] });
    }

    const results = await provider.searchCities(query);

    res.json({ results });
  } catch (error) {
    next(error);
  }
};

exports.coordinates = async (req, res, next) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({ error: "Valid latitude and longitude are required." });
    }

    const weather = await provider.getWeatherByCoordinates({
      name: "Selected map location",
      country: "",
      admin1: "",
      timezone: "auto",
      latitude,
      longitude
    });

    res.json(weather);
  } catch (error) {
    next(error);
  }
};
