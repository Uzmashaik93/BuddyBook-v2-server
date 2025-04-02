import express from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

//  GET /api/teams -  Retrieves all of the teams

router.get("/", async (req: Request, res: Response) => {

    try {
        const response = await prisma.team.findMany();
        if (!response || response.length === 0) {
            res.status(404).json({ message: "No teams found" });
            return;
        }
        res.status(200).json({ message: "Teams fetched successfully", teams: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

})

// POST /api/teams -  Creates a new team

router.post("/", async (req: Request, res: Response) => {
    try {
        const { teamName, createdBy } = req.body;
        const response = await prisma.team.create({
            data: {
                teamName,
                createdBy,
                createdByEmail: req.user?.email || "unknown",
                timestamp: new Date().toISOString(),
            }
        })
        res.status(201).json({ message: "Team created successfully", team: response });
        res.json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
)

// GET /api/teams/:id -  Retrieves a team by id
router.get("/:teamId", async (req: Request, res: Response) => {
    const { teamId } = req.params;
    try {

        const response = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        });
        if (!response) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        else {
            res.status(200).json({ message: "Team fetched successfully", team: response });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

})

// PUT /api/teams/:id -  Updates a team by id
router.patch("/:teamId", async (req: Request, res: Response) => {
    const { teamId } = req.params;
    try {
        const { teamName, createdBy, createdByEmail, timestamp } = req.body;
        const response = await prisma.team.update({
            where: {
                id: teamId
            },
            data: {
                teamName,
                createdBy,
                createdByEmail,
                timestamp
            }
        });
        res.status(200).json({ message: "Team updated successfully", team: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

// DELETE /api/teams/:id -  Deletes a team by id
router.delete("/:teamId", async (req: Request, res: Response) => {
    const { teamId } = req.params;
    try {
        const response = await prisma.team.delete({
            where: {
                id: teamId
            }
        });
        res.status(200).json({ message: `Team with id ${teamId} deleted successfully`, team: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;