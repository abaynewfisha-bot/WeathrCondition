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

exports.getById = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ error: "City not found." });
    }
    res.json({ city });
  } catch (error) {
    next(error);
  }
};
