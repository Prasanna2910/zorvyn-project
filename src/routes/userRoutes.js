const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  loginUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { loginLimiter } = require("../middleware/rateLimiter");

// ================= PUBLIC ROUTES =================

// Create user
router.post("/", createUser);

// Login
router.post("/login", loginLimiter, loginUser);

// ================= PROTECTED ROUTES =================

// Only ADMIN can view all users
router.get("/", authMiddleware, authorizeRoles("ADMIN"), getUsers);

module.exports = router;
