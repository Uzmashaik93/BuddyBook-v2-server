import { Request, Response, NextFunction, Router } from 'express';
const router = Router();
import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});

router.get('/health', async (req, res) => {
  try {
    // Perform a simple query to verify the DB is alive
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {

    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to the database',
    });
  }
});

export default router;
