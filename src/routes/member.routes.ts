import express, { NextFunction } from "express";
import { Request, Response, Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { age,
            customQuestion,
            hobbies,
            linkedIn,
            name,
            place,
            question1,
            question2 } = req.body;
        const response = await prisma.member.create({
            data: {
                age,
                customQuestion,
                hobbies,
                linkedIn,
                name,
                place,
                question1,
                question2
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