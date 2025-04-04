import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

router.get("/:teamId", async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    console.log("teamId", teamId);

    try {
        const response = await prisma.member.findMany({
            where: {
                teamId: teamId
            }
        });
        if (!response || response.length === 0) {
            res.status(404).json({ message: "No members found" });
            return;
        }
        res.status(200).json({ message: "Members fetched successfully", members: response });

    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }
})

router.post("/:teamId/member", async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;

    try {
        const { age,
            customQuestion,
            hobbies,
            linkedIn,
            name,
            place,
            question1,
            question2,

        } = req.body;
        const response = await prisma.member.create({
            data: {
                age,
                customQuestion,
                hobbies,
                linkedIn,
                name,
                place,
                question1,
                question2,
                teamId
            }
        });
        res.status(201).json({ message: "Member created", member: response })

    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }


})



export default router;