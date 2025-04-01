import dotenv from "dotenv";
import express from "express";
import { config } from "./config/index";
import indexRoutes from "./src/routes/index.routes";
import authRoutes from "./src/routes/auth.routes";
import { errorHandling } from "./src/error-handling";

dotenv.config();

const app = express();

config(app);
errorHandling(app);

app.use("/api", indexRoutes);

app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes

export default app;
