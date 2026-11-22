const router = require("express").Router();
const controller = require("../controllers/weatherController");
const { validateCity } = require("../middleware/validate");

router.get("/search", controller.search);
router.get("/coordinates", controller.coordinates);
router.get("/current", validateCity, controller.get);
router.get("/hourly", validateCity, controller.get);
router.get("/", validateCity, controller.get);
router.get("/forecast", validateCity, controller.get);

module.exports = router;
