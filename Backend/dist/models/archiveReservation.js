"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservation_1 = require("./reservation");
const archiveReservationSchema = new mongoose_1.default.Schema({
    reservation: reservation_1.reservationSchema,
    comment: String,
    rating: Number
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('ArchiveReservationModel', archiveReservationSchema, 'archiveReservations');
