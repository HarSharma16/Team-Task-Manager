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

app.set("trust proxy", 1);

const configuredClientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const allowLocalDevOrigin = (origin = "") => /^http:\/\/localhost:\d+$/.test(origin);

const ensureDatabaseConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server/non-browser requests without Origin.
      if (!origin) {
        return callback(null, true);
      }

      if (configuredClientUrls.includes(origin) || allowLocalDevOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for origin"));
    },
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
