const City = require("../models/City");
const provider = require("../services/openWeatherService");

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

exports.list = async (req, res, next) => {
  try {
    const cities = await City.list();

    res.json({ cities });
  } catch (error) {
    next(error);
  }
};
