import { Request, Response, NextFunction, Router } from 'express';
import { isAuthenticated } from "../middleware/jwt.middleware";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
const prisma = new PrismaClient();

const saltRounds = 10;

// ✅ POST /auth/signup - Creates a new user
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      res
        .status(400)
        .json({ message: "Provide email, password, and name." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ message: "Provide a valid email address." });
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const foundUser = await prisma.user.findUnique({ where: { email } });

    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    const { id } = newUser;
    res.status(201).json({ user: { id, email, username } });
  } catch (error) {
    next(error);
  }
});

// ✅ POST /auth/login - Verifies credentials and returns JWT
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }

    const foundUser = await prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!passwordCorrect) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const { id, username } = foundUser;
    const payload = { id, email, username };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET || "", {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

// ✅ GET /auth/verify - Verifies JWT
router.get("/verify", isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
  console.log(`req.payload`, req.user);
  res.status(200).json(req.user);
});

export default router;
