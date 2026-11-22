const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/settingsController");

router.use(auth);
router.get("/", controller.get);
router.put("/", controller.update);

module.exports = router;
