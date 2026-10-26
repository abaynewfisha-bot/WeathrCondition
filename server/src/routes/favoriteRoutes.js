const router = require("express").Router();
const controller = require("../controllers/favoriteController");
const auth = require("../middleware/authMiddleware");

router.use(auth);

router.get("/", controller.list);
router.post("/", controller.add);
router.delete("/:id", controller.remove);

module.exports = router;
