import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables (if using dotenv)
dotenv.config();

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

export function config(app: express.Application) {
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [FRONTEND_URL],
      credentials: true, // ✅ Allow cookies & authentication headers
      methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Specify allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow custom headers
    })
  );

  // Development logging
  app.use(logger("dev"));

  // Parse JSON and URL-encoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
}
