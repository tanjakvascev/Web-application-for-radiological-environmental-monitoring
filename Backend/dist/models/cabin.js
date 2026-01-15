"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const price_1 = require("./price");
const cabinSchema = new mongoose_1.default.Schema({
    host: String,
    name: String,
    location: String,
    services: String,
    priceList: [price_1.PriceSchema],
    phone: String,
    latitude: Number,
    longitude: Number,
    ratings: [Number],
    comments: [String],
    gallery: [String]
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('CabinModel', cabinSchema, 'cabins');
