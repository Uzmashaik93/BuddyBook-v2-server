import express from "express";
import { Request, Response, Router, NextFunction } from "express";
import { Prisma, PrismaClient, Team } from "@prisma/client";
import { timeStamp } from "console";
import { sendInvite } from "../utils/mailer";
const prisma = new PrismaClient();
const router = Router();

router.get('/:teamId/:memberId', async (req: Request, res: Response) => {
    const { teamId, memberId } = req.params;

    try {
        const counts = await prisma.reaction.groupBy({
            by: ['type'],
            where: { teamId: teamId, memberId: memberId },
            _count: true,
        });

        const userReaction = await prisma.reaction.findFirst({
            where: { teamId: teamId, memberId: memberId },
        });

        const formattedCounts = counts.reduce((acc, item) => {
            acc[item.type] = item._count;
            return acc;
        }, {} as Record<string, number>);

        res.json({
            counts: formattedCounts,
            userReaction: userReaction?.type || null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reactions' });
    }
});


router.post('/:memberId', async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const { type, teamId, reactionId } = req.body;

    try {
        // If reactionId is provided, update the existing reaction
        if (reactionId) {
            const updated = await prisma.reaction.update({
                where: {
                    id: reactionId,
                },
                data: {
                    type,
                    teamId,
                    memberId,
                },
            });
            res.status(200).json(updated);
            return
        }

        // Otherwise, check if a reaction already exists for this memberId and teamId
        const existing = await prisma.reaction.findFirst({
            where: {
                memberId,  // User-specific
                teamId,    // Team-specific
                type,      // Reaction type
            },
        });

        if (existing) {
            // If the reaction exists, update it with the new type
            const updated = await prisma.reaction.update({
                where: {
                    id: existing.id,  // Use the existing reaction's ID
                },
                data: {
                    type,  // Update the reaction type
                },
            });
            res.status(200).json(updated);
            return
        } else {
            // If no existing reaction, create a new one for this user and team
            const reaction = await prisma.reaction.create({
                data: { teamId, memberId, type },
            });
            res.status(201).json(reaction);
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create or update reaction' });
        return
    }
});




export default router;