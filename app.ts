import dotenv from "dotenv";
import express from "express";
import { config } from "./config/index";
import indexRoutes from "./src/routes/index.routes";
import authRoutes from "./src/routes/auth.routes";
import { errorHandling } from "./src/error-handling";
import teamsRoutes from "./src/routes/team.routes";
import { isAuthenticated } from "./src/middleware/jwt.middleware";
import teamRoute from "./src/routes/member.routes";

dotenv.config();

const app = express();

config(app);

app.use("/api", indexRoutes);

app.use("/auth", authRoutes);

app.use("/teams", isAuthenticated, teamsRoutes);

app.use("/team", isAuthenticated, teamRoute);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
errorHandling(app);

export default app;
