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
