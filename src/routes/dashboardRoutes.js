const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getSummary,
  getCategoryWise,
  getRecent,
  getMonthly,
} = require("../controllers/dashboardController");

// 🔐 Apply middleware to all routes
router.use(authMiddleware);
router.use(authorizeRoles("ADMIN", "ANALYST"));

// 📊 Dashboard Routes
router.get("/summary", getSummary);
router.get("/category-wise", getCategoryWise);
router.get("/recent", getRecent);
router.get("/monthly", getMonthly);

module.exports = router;