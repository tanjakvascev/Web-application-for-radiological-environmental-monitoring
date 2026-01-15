"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const registerRequestSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    gender: String,
    address: String,
    phone: String,
    email: String,
    profileImage: String,
    creditCard: String,
    cardType: String,
    role: String,
    active: Boolean
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('registerRequestModel', registerRequestSchema, 'registerRequests');
