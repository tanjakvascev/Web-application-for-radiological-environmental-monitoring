"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.reservationSchema = new mongoose_1.default.Schema({
    host: String,
    name: String,
    location: String,
    tourist: String,
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
    numberAdults: Number,
    numberKids: Number,
    creditCard: String,
    price: Number,
    requests: String,
    approved: String,
    dateMade: String,
    timeMade: String,
    comment: String
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('ReservationModel', exports.reservationSchema, 'reservations');
