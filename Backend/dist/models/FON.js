"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FONSchema = new mongoose_1.default.Schema({
    isotope: String,
    geometry: String,
    detector: String,
    FON: { type: [Number] }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('FONModel', FONSchema, 'FON');
