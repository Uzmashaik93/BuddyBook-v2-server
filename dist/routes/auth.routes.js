"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const jwt_middleware_1 = require("../middleware/jwt.middleware");
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;
// ✅ POST /auth/signup - Creates a new user
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res
                .status(400)
                .json({ message: "Provide email, password, and name." });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({ message: "Provide a valid email address." });
        }
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long and contain at least one number, one lowercase and one uppercase letter.",
            });
        }
        const foundUser = yield prisma.user.findUnique({ where: { email } });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        const newUser = yield prisma.user.create({
            data: { email, password: hashedPassword, username },
        });
        const { id } = newUser;
        res.status(201).json({ user: { id, email, username } });
    }
    catch (error) {
        next(error);
    }
}));
// ✅ POST /auth/login - Verifies credentials and returns JWT
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Provide email and password." });
        }
        const foundUser = yield prisma.user.findUnique({ where: { email } });
        if (!foundUser) {
            return res.status(401).json({ message: "User not found." });
        }
        const passwordCorrect = yield bcrypt.compare(password, foundUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const { id, username } = foundUser;
        const payload = { id, email, username };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
        });
        res.status(200).json({ authToken });
    }
    catch (error) {
        next(error);
    }
}));
// ✅ GET /auth/verify - Verifies JWT
router.get("/verify", jwt_middleware_1.isAuthenticated, (req, res, next) => {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
});
module.exports = router;
