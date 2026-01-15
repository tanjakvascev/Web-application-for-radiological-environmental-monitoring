"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CalculationSchema = new mongoose_1.default.Schema({
    internID: String,
    isotopes: { type: [String] },
    values: { type: [Number] },
    errs: { type: [Number] },
    examiner: String
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('CalculationModel', CalculationSchema, 'calculations');
