"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    var _a;
    console.log("Token");
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Get the token from the Authorization header
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        // Decode the JWT using the type
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'your-secret-key');
        req.user = decoded; // Add the decoded user to the request object
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
