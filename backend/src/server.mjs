import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import notesRoutes from "../src/routes/notesRoutes.js";
import rateLimit from "./config/upstash.js";
import rateLimiter from "./config/ratelimit.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Logging for debugging deployment
console.log("🚀 Starting server...");
console.log("📁 Current directory:", __dirname);
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔌 PORT:", process.env.PORT || 5001);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
  }));
} else {
  app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
  }));
}

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use("/api/notes", notesRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Multiple possible paths for frontend dist folder
  const possiblePaths = [
    path.resolve(__dirname, "../../frontend/dist"),
    path.resolve(__dirname, "../frontend/dist"),
    path.resolve(__dirname, "./frontend/dist"),
    path.resolve(__dirname, "frontend/dist"),
    path.resolve(__dirname, "dist"),
    path.resolve(__dirname, "../dist"),
    path.resolve(process.cwd(), "frontend/dist"),
    path.resolve(process.cwd(), "dist")
  ];
  
  let distPath = null;
  
  // Find the correct path
  for (const testPath of possiblePaths) {
    console.log(`🔍 Checking path: ${testPath}`);
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      console.log(`✅ Found frontend at: ${distPath}`);
      break;
    }
  }
  
  if (distPath) {
    // Serve static files
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: false
    }));
    
    // Handle React Router - send all non-API routes to index.html
    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error("❌ index.html not found at:", indexPath);
          res.status(404).send("Frontend index.html not found");
        }
      } catch (err) {
        console.error("❌ Failed to send index.html:", err.message);
        res.status(500).json({
          error: "Internal Server Error",
          message: "Failed to serve frontend"
        });
      }
    });
  } else {
    console.error("❌ Frontend dist folder not found!");
    console.log("📁 Available files in current directory:");
    try {
      const files = fs.readdirSync(__dirname);
      console.log(files);
    } catch (err) {
      console.error("Could not read directory:", err.message);
    }
    
    app.get("*", (req, res) => {
      res.status(404).json({
        error: "Frontend not found",
        message: "Frontend build files are not available",
        availablePaths: possiblePaths
      });
    });
  }
} else {
  // Development mode
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

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 5001;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

app.listen(PORT, HOST, () => {
  console.log(`🎉 Server started successfully!`);
  console.log(`🌐 Server running on ${HOST}:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  
  if (process.env.NODE_ENV !== "production") {
    console.log(`🔧 API Base: http://${HOST}:${PORT}/api`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});