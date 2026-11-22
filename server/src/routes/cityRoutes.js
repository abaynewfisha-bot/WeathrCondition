const router = require("express").Router();
const controller = require("../controllers/cityController");

router.get("/search", controller.search);
router.get("/", controller.list);
router.get("/:id", controller.getById);

module.exports = router;
