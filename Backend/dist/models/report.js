"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    internID: String,
    examiner: String,
    technicalMenager: String,
    date: Date,
    isotopes: { type: [String] },
    values: { type: [Number] },
    errs: { type: [Number] },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    wordPath: String,
    pdfPath: String
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('reportModel', reportSchema, 'reports');
