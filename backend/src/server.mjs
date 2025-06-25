import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import notesRoutes from "../src/routes/notesRoutes.js";
import rateLimit from "./config/upstash.js";
import rateLimiter from "./config/ratelimit.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Logging
console.log("🚀 Starting server...");
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔌 PORT:", process.env.PORT || 5001);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate Limiting
app.use(rateLimiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use("/api/notes", notesRoutes);

// 404 handler for API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.originalUrl
  });
});

// Default route for development
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.json({
      message: "API is running in development mode...",
      environment: "development",
      endpoints: {
        health: "/health",
        notes: "/api/notes"
      }
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5001;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

app.listen(PORT, HOST, () => {
  console.log(`🎉 Server started successfully!`);
  console.log(`🌐 Server running on ${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});
