const express = require("express");
const { signup, login, me, listUsers } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/users", protect, authorizeRoles("admin"), listUsers);

module.exports = router;
