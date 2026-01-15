"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// tajni ključ iz okruženja
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // ako imas custom Request tip, bolje ga prosiri
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
