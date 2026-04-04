const rateLimit = require("express-rate-limit");

const baseConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later",
  },
};

const apiLimiter = rateLimit(baseConfig);

// Reusable limiter for sensitive endpoints like login.
const loginLimiter = rateLimit(baseConfig);

module.exports = {
  apiLimiter,
  loginLimiter,
};
