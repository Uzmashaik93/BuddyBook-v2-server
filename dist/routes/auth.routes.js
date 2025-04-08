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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_middleware_1 = require("../middleware/jwt.middleware");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const saltRounds = 10;
// ✅ POST /auth/signup - Creates a new user
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                message: "Password must be at least 6 characters long and contain at least one number, one lowercase and one uppercase letter.",
            });
            return;
        }
        const foundUser = yield prisma.user.findUnique({ where: { email } });
        if (foundUser) {
            res.status(400).json({ message: "User already exists." });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
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
            res.status(400).json({ message: "Provide email and password." });
            return;
        }
        const foundUser = yield prisma.user.findUnique({ where: { email } });
        if (!foundUser) {
            res.status(401).json({ message: "User not found." });
            return;
        }
        const passwordCorrect = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!passwordCorrect) {
            res.status(401).json({ message: "Invalid credentials." });
            return;
        }
        const { id, username } = foundUser;
        const payload = { id, email, username };
        const authToken = jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET || "", {
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
    console.log(`req.payload`, req.user);
    res.status(200).json(req.user);
});
exports.default = router;
