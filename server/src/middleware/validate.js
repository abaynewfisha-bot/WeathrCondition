exports.validateCity = (req, res, next) => {
  const city = String(req.query.city || "").trim();

  if (!city || city.length > 100) {
    return res.status(400).json({
      error: "Provide a city name between 1 and 100 characters."
    });
  }

  req.cityName = city;
  next();
};
