import express from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {

})

router.post("/", async (req: Request, res: Response) => {
    try {
        const { teamName, createdBy } = req.body;
        const newTeam = {
            teamName,
            createdBy,
            createdByEmail: req.user?.email || "unknown",
        }

        console.log(newTeam);
        const response = await prisma.team.create({
            data: newTeam,
        })
        res.send(response);

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
)

export default router;