import express from "express";
import { Request, Response, Router } from "express";
import { isAuthenticated } from "../middleware/jwt.middleware";
const router = Router();


router.post("/teams", async (req, res) => {

})

export default router;