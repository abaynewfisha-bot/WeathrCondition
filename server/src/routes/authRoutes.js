const router = require("express").Router();
const controller = require("../controllers/authController");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", require("../middleware/authMiddleware"), controller.me);
router.post("/logout", require("../middleware/authMiddleware"), controller.logout);

module.exports = router;
