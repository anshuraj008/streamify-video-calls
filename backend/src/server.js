import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

// Configure CORS to allow both local and production frontends
const allowedOrigins = [
  "https://streamify-video-calls-j2ci.vercel.app",
  "http://localhost:5173"
  ,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin matches allowed origins or is from Vercel preview deployment
      if (allowedOrigins.includes(origin) || (origin && origin.includes('streamify-video-calls') && origin.includes('.vercel.app'))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// Middleware to ensure DB connection for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Root endpoint for testing
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running!", status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
