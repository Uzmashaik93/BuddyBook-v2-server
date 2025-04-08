import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

router.get("/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { memberId } = req.params;
    try {
        const response = await prisma.comment.findMany({
            where: {
                memberId: memberId
            }
        });
        if (!response || response.length === 0) {
            res.status(404).json({ message: "No comments found" });
            return;
        }
        res.status(200).json({ message: "Comments fetched successfully", comments: response });
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.post("/member/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { memberId } = req.params;

    try {
        const { comment } = req.body;

        const response = await prisma.comment.create({
            data: {
                comment,
                name: req.user?.username || "unknown",
                memberId
            }
        });
        res.status(201).json({ message: "Comment created", comment: response })

    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete("/:commentId", async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    try {
        const response = await prisma.comment.delete({
            where: {
                id: commentId
            }
        });
        if (!response) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json({ message: "Comment deleted successfully", comment: response });
    }
    catch (error) {
        res.status(500).json(error)
    }
})
router.put("/:commentId", async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    try {
        const { comment } = req.body;
        const response = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                comment
            }
        });
        if (!response) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json({ message: "Comment updated successfully", comment: response });
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:commentId", async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    try {
        const response = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });
        if (!response) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json({ message: "Comment fetched successfully", comment: response })
    }
    catch (error) {
        res.status(500).json(error)
    }
})

export default router;