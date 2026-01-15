"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require('bcryptjs');
const userSchema = new mongoose_1.default.Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: { type: String, required: true },
    role: String
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('UserModel', userSchema, 'users');
