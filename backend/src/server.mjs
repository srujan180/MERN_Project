import express from "express";
import dotenv from "dotenv"
import {connectDB} from "../config/db.js"
import notesRoutes from "../src/routes/notesRoutes.js";
import rateLimit from "../config/upstash.js";
import rateLimiter from "../config/ratelimit.js";
dotenv.config();

const app = express() 
connectDB();
app.use(express.json());
app.use(rateLimiter);
app.use("/api/notes", notesRoutes)
app.listen(5001,()=>{
console.log("server started on port :5001")
});