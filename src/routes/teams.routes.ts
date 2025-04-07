import express from "express";
import { Request, Response, Router, NextFunction } from "express";
import { Prisma, PrismaClient, Team } from "@prisma/client";
import { timeStamp } from "console";
const prisma = new PrismaClient();
const router = Router();

//  GET /api/teams -  Retrieves all of the teams

router.get("/", async (req: Request, res: Response) => {

    try {
        const response = await prisma.team.findMany(
            {
                where: {
                    userId: req.user?.id,

                },
                include: {
                    members: true,
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            username: true
                        }
                    },
                    invites: true
                }
            }
        ) ?? []
        console.log("response", response);

        const memberList = await prisma.member.findMany(
            {
                where: {
                    userId: req.user.id

                },
                include: {
                    Team: {
                        include: {
                            createdBy: {
                                select: {
                                    id: true,
                                    email: true,
                                    username: true
                                }
                            },
                            members: true,
                            invites: true

                        }
                    },

                }
            }
        ) ?? []

        const teamsUserIsMemberOf = memberList.reduce((acc: Team[], value): Team[] => {

            if (!value.Team) {
                return acc;
            }

            const teamValue = response.find(x => x.id === value.teamId);

            return teamValue === undefined ? [...acc, value.Team] : acc
        }, [])

        console.log("teamsUserIsMemberOf", teamsUserIsMemberOf)

        const teams = [...response, ...teamsUserIsMemberOf];

        res.status(200).json({ message: "Teams fetched successfully", teams: teams });
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
                userId: req.user?.id,
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

router.post("/invite/:teamId", async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { inviteEmail } = req.body;

    try {

        // Check if the team exists
        const existingInvite = await prisma.teamInvite.findFirst({
            where: {
                teamId,
                invitedUserEmail: inviteEmail,
            },
        });

        if (existingInvite) {
            res.status(400).json({ message: "User is already invited to this team" });
            return;
        }


        const response = await prisma.teamInvite.create({
            data: {
                teamId,
                invitedUserEmail: inviteEmail,
                status: "PENDING",
            },
        })

        res.status(201).json({ "Response": response, message: "Team invite created successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})



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
router.put("/:teamId", async (req: Request, res: Response) => {
    const { teamId } = req.params;
    try {
        const { teamName } = req.body;

        const teamExists = await prisma.team.findUnique({
            where: {
                id: teamId,
                userId: req.user?.id
            }
        });

        if (teamExists) {

            const response = await prisma.team.update({
                where: {
                    id: teamId
                },
                data: {
                    teamName,
                }
            });
            res.status(200).json({ message: "Team updated successfully", team: response });
        } else {
            res.status(404).json({ message: "Team not found" });
        }
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