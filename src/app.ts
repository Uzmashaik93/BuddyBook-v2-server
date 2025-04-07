import dotenv from "dotenv";
import express from "express";
import { config } from "./config/index";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandling } from "./error-handling";
import teamsRoutes from "./routes/teams.routes";
import { isAuthenticated } from "./middleware/jwt.middleware";
import memberRoutes from "./routes/member.routes";
import commentsRoutes from "./routes/comments.routes";
import customAnswersRoutes from "./routes/customAnswers.routes";
import invitesRoutes from "./routes/invites.routes";

dotenv.config();

const app = express();

config(app);

app.use("/api", indexRoutes);

app.use("/auth", authRoutes);

app.use("/teams", isAuthenticated, teamsRoutes);

app.use("/team", isAuthenticated, memberRoutes);

app.use("/comments", isAuthenticated, commentsRoutes);

app.use("/custom", isAuthenticated, customAnswersRoutes);

app.use("/invites", isAuthenticated, invitesRoutes);




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
errorHandling(app);

export default app;
