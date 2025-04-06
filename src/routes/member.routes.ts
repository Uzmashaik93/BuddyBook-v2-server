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
                teamId: teamId,

            }, include: {
                userProfile: {
                    select: {
                        id: true,
                        email: true,
                        username: true,

                    }
                },
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
                teamId,
                userId: req.user?.id,
            }
        });
        res.status(201).json({ message: "Member created", member: response })

    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }


})


router.get("/:teamId/member/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, memberId } = req.params;
    console.log("teamId", teamId);
    console.log("memberId", memberId);
    try {
        const response = await prisma.member.findUnique({
            where: {
                id: memberId
            },
            include: {
                comments: true,
                customAnswers: true
            }
        });
        if (!response) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        res.status(200).json({ message: "Member fetched successfully", member: response })
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }
})

router.put("/:teamId/member/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, memberId } = req.params;
    console.log("teamId", teamId);
    console.log("memberId", memberId);
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
        const response = await prisma.member.update({
            where: {
                id: memberId
            },
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
        res.status(200).json({ message: "Member updated", member: response })
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }
})

router.delete("/:teamId/member/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { teamId, memberId } = req.params;
    console.log("teamId", teamId);
    console.log("memberId", memberId);
    try {
        const response = await prisma.member.delete({
            where: {
                id: memberId
            }
        });
        res.status(200).json({ message: "Member deleted", member: response })
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }
})


export default router;