const City = require("../models/City");
const Favorite = require("../models/Favorite");
const provider = require("../services/openWeatherService");

exports.list = async (req, res, next) => {
  try {
    const favorites = await Favorite.listForUser(req.user.id);

    res.json({ favorites });
  } catch (error) {
    next(error);
  }
};

exports.add = async (req, res, next) => {
  try {
    const cityName = String(req.body.cityName || "").trim();
    const country = String(req.body.country || "").trim();

    if (!cityName) {
      return res.status(400).json({
        error: "cityName is required."
      });
    }

    const matches = await provider.searchCities(cityName);

    const match =
      matches.find(
        (city) =>
          country &&
          city.country.toLowerCase() === country.toLowerCase()
      ) || matches[0];

    if (!match) {
      return res.status(404).json({ error: "City not found." });
    }

    const city = await City.upsert(match);
    const favorite = await Favorite.add(req.user.id, city.id);

    res.status(201).json({ favorite });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await Favorite.remove(
      req.params.id,
      req.user.id
    );

    if (!removed) {
      return res.status(404).json({
        error: "Favorite not found."
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
