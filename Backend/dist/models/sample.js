"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sampleSchema = new mongoose_1.default.Schema({
    internID: String,
    sampleID: String,
    name: String,
    origin: String,
    dateReception: String,
    dateMeasure: String,
    type: String,
    note: String,
    user: String,
    geometry: String,
    detector: String,
    nameHistory: [
        {
            oldValue: String,
            newValue: String,
            changedAt: Date,
            changedBy: String,
        }
    ]
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('SampleModel', sampleSchema, 'samples');
