const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    message: "WeatherWorld API",
    endpoints: [
      "/api/health",
      "/api/weather?city=Nairobi",
      "/api/cities",
      "/api/cities/search?q=Nai",
      "/api/auth/register",
      "/api/auth/login",
      "/api/favorites"
    ]
  });
});

router.use("/weather", require("./weatherRoutes"));
router.use("/cities", require("./cityRoutes"));
router.use("/auth", require("./authRoutes"));
router.use("/favorites", require("./favoriteRoutes"));

module.exports = router;
