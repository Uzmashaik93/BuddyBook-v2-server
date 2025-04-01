import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// To use environment variables
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";


export function config(app: express.Application) {

  app.set("trust proxy", 1);


  app.use(
    cors({
      origin: [FRONTEND_URL],
    })
  );

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
