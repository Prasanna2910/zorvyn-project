const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
