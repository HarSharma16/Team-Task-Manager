const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ✅ Trust Railway proxy (important)
app.set("trust proxy", 1);

// ❌ REMOVE this (no longer needed for now)
// const configuredClientUrls = ...
// const allowLocalDevOrigin = ...

const ensureDatabaseConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

app.use(helmet());

// ✅ TEMPORARY CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "team-task-manager-api",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "team-task-manager-api",
    databaseConfigured: Boolean(process.env.MONGO_URI),
    jwtConfigured: Boolean(process.env.JWT_SECRET),
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", ensureDatabaseConnection, authRoutes);
app.use("/api/projects", ensureDatabaseConnection, projectRoutes);
app.use("/api/tasks", ensureDatabaseConnection, taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;