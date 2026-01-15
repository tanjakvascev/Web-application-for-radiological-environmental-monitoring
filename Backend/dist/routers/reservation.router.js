"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservation_controller_1 = require("../controllers/reservation.controller");
const reservationRouter = express_1.default.Router();
reservationRouter.route("/newReservation").post((req, res) => new reservation_controller_1.ReservationController().newReservation(req, res));
reservationRouter.route("/getReservationsHost").get((req, res) => new reservation_controller_1.ReservationController().getReservationsHost(req, res));
reservationRouter.route("/getReservationsTourist").get((req, res) => new reservation_controller_1.ReservationController().getReservationsTourist(req, res));
reservationRouter.route("/getAllReservations").get((req, res) => new reservation_controller_1.ReservationController().getAllReservations(req, res));
reservationRouter.route("/updateReservation").post((req, res) => new reservation_controller_1.ReservationController().updateReservation(req, res));
reservationRouter.route("/cancelReservation").post((req, res) => new reservation_controller_1.ReservationController().cancelReservation(req, res));
reservationRouter.route("/getStats").get((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new reservation_controller_1.ReservationController().getStats(req, res); }));
reservationRouter.route("/addToArchive").post((req, res) => new reservation_controller_1.ReservationController().addToArchive(req, res));
reservationRouter.route("/getAllArchiveReservations").get((req, res) => new reservation_controller_1.ReservationController().getAllArchiveReservations(req, res));
reservationRouter.route("/updateArchive").post((req, res) => new reservation_controller_1.ReservationController().updateArchive(req, res));
exports.default = reservationRouter;
