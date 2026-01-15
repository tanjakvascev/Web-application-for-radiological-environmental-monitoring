"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceSchema = new mongoose_1.default.Schema({
    date: String,
    requestNumber: Number,
    internIDs: String,
    sampleNumber: Number,
    comment: String
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('invoiceModel', invoiceSchema, 'invoices');
