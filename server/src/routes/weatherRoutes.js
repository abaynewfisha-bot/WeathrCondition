const router = require("express").Router();
const controller = require("../controllers/weatherController");
const { validateCity } = require("../middleware/validate");

router.get("/search", controller.search);
router.get("/", validateCity, controller.get);
router.get("/forecast", validateCity, controller.get);

module.exports = router;
