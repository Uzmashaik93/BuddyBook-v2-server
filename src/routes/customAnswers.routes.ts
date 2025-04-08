import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

router.get("/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { memberId } = req.params;
    try {
        const response = await prisma.customAnswer.findMany({
            where: {
                memberId: memberId
            }
        });
        if (!response || response.length === 0) {
            res.status(404).json({ message: "No custom answers found" });
            return;
        }
        res.status(200).json({ message: "Custom answers fetched successfully", customAnswers: response });
    }
    catch (error) {
        res.status(500).json(error)
    }
})

router.post("/member/:memberId", async (req: Request, res: Response, next: NextFunction) => {
    const { memberId } = req.params;

    try {
        const { answer, question } = req.body;

        const response = await prisma.customAnswer.create({
            data: {
                answer,
                email: req.user?.email || "unknown",
                name: req.user?.username || "unknown",
                memberId
            }
        });
        res.status(201).json({ message: "Custom answer created", customAnswer: response })

    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete("/:customAnswerId", async (req: Request, res: Response, next: NextFunction) => {
    const { customAnswerId } = req.params;
    try {
        const response = await prisma.customAnswer.delete({
            where: {
                id: customAnswerId
            }
        });
        if (!response) {
            res.status(404).json({ message: "Custom answer not found" });
            return;
        }
        res.status(200).json({ message: "Custom answer deleted successfully", customAnswer: response });
    } catch (error) {
        res.status(500).json(error)
    }
}
)

router.put("/:customAnswerId", async (req: Request, res: Response, next: NextFunction) => {
    const { customAnswerId } = req.params;
    try {
        const { answer, question } = req.body;
        const response = await prisma.customAnswer.update({
            where: {
                id: customAnswerId
            },
            data: {
                answer,
            }
        });
        if (!response) {
            res.status(404).json({ message: "Custom answer not found" });
            return;
        }
        res.status(200).json({ message: "Custom answer updated successfully", customAnswer: response });
    } catch (error) {
        res.status(500).json(error)
    }
}
)

router.get("/:customAnswerId", async (req: Request, res: Response, next: NextFunction) => {
    const { customAnswerId } = req.params;
    try {
        const response = await prisma.customAnswer.findUnique({
            where: {
                id: customAnswerId
            }
        });
        if (!response) {
            res.status(404).json({ message: "Custom answer not found" });
            return;
        }
        res.status(200).json({ message: "Custom answer fetched successfully", customAnswer: response });
    } catch (error) {
        res.status(500).json(error)
    }
}
)

export default router;