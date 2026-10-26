const router = require("express").Router();
const controller = require("../controllers/cityController");

router.get("/search", controller.search);
router.get("/", controller.list);

module.exports = router;
