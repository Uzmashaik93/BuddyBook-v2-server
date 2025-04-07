import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await prisma.teamInvite.findMany({
            where: {
                invitedUserEmail: req.user?.email,
                status: "PENDING"
            },
            include: {
                team: {
                    select: {
                        id: true,
                        teamName: true,
                        userId: true,
                        createdBy: {
                            select: {
                                id: true,
                                email: true,
                                username: true
                            }
                        },
                    }
                },
            }
        });

        res.status(200).json({ message: "Invites fetched successfully", invites: response || [] });
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }
})

router.put("/:inviteId", async (req: Request, res: Response, next: NextFunction) => {
    const { inviteId } = req.params;
    try {
        const response = await prisma.teamInvite.update({
            where: {
                id: inviteId
            },
            data: {
                status: req.body.status,
            }
        });
        if (!response) {
            res.status(404).json({ message: "Invite not found" });
            return;
        }
        res.status(200).json({ message: "Invite updated successfully", invite: response });
    }
    catch (error) {
        console.log("Error", error);
        res.status(500).json(error)
    }
})


export default router;