import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import notesRoutes from "../src/routes/notesRoutes.js";
import rateLimit from "./config/upstash.js";
import rateLimiter from "./config/ratelimit.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use(rateLimiter);

// API Routes
app.use("/api/notes", notesRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../../frontend/dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    try {
      res.sendFile(path.join(distPath, "index.html"));
    } catch (err) {
      console.error("Failed to send index.html:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
