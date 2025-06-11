import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "module-alias/register";
import { setupApp } from "./app.module";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS Configuration
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// JSON Parsing & URL Encoded Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for compression
app.use(compression());

// Middleware for parsing cookies
app.use(cookieParser());

// Optional: Handle preflight requests
app.options("*", cors());

// Setup Application Modules
setupApp(app);

// Start the server
const port = process.env.PORT || 8081;
app
  .listen(port, () => {
    console.log(
      `🚀 Server is running in ${process.env.NODE_ENV} mode on http://localhost:${port} 🚀`
    );
  })
  .on("error", (error) => {
    console.error("Server startup error:", error);
  });
