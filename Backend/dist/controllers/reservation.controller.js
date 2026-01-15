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
exports.ReservationController = void 0;
const reservation_1 = __importDefault(require("../models/reservation"));
const cabin_1 = __importDefault(require("../models/cabin"));
const archiveReservation_1 = __importDefault(require("../models/archiveReservation"));
class ReservationController {
    constructor() {
        this.newReservation = (req, res) => {
            new reservation_1.default(req.body).save().then(ok => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Neuspesno dodavanje rezervacije." });
            });
        };
        this.getReservationsHost = (req, res) => {
            reservation_1.default.find({ host: req.query.host, approved: "waiting" }).then(reservations => {
                res.json(reservations);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getReservationsTourist = (req, res) => {
            reservation_1.default.find({
                tourist: req.query.tourist,
                approved: { $in: ["finished", "approved"] }
            }).then(reservations => {
                res.json(reservations);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getAllReservations = (req, res) => {
            reservation_1.default.find().then(reservations => {
                res.json(reservations);
            }).catch(err => {
                res.json(null);
            });
        };
        this.updateReservation = (req, res) => {
            const { host, tourist, name, dateMade, timeMade, approved, comment } = req.body;
            reservation_1.default.updateOne({ host, tourist, name, dateMade, timeMade }, { $set: { approved, comment } }).then(result => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Neuspesno azuriranje rezervacije" });
            });
        };
        this.cancelReservation = (req, res) => {
            const { host, name, tourist, startDate, endDate, dateMade, timeMade } = req.body;
            reservation_1.default.deleteOne({
                host, name, tourist, startDate, endDate, dateMade, timeMade
            }).then(ok => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Greska prilikom brisanja" });
            });
        };
        this.getStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const host = req.query.host;
            try {
                const cabins = yield cabin_1.default.find({ host });
                const reservations = yield reservation_1.default.find({
                    host,
                    approved: { $in: ["approved", "finished"] }
                });
                const byMonth = {};
                const weekendVsWeekday = {};
                for (const cabin of cabins) {
                    const name = cabin.name;
                    byMonth[name] = {};
                    weekendVsWeekday[name] = { weekend: 0, weekday: 0 };
                }
                for (const res of reservations) {
                    const start = new Date(res.startDate);
                    const end = new Date(res.endDate);
                    const cabin = res.name;
                    const monthsAdded = new Set();
                    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                        const day = d.getDay();
                        if (day === 0 || day === 6)
                            weekendVsWeekday[cabin].weekend++;
                        else
                            weekendVsWeekday[cabin].weekday++;
                        const month = d.getMonth();
                        if (!monthsAdded.has(month)) {
                            monthsAdded.add(month);
                            byMonth[cabin][month] = (byMonth[cabin][month] || 0) + 1;
                        }
                    }
                }
                res.json({ byMonth, weekendVsWeekday });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Greška pri dohvatanju statistike." });
            }
        });
        this.addToArchive = (req, res) => {
            const archiveData = {
                reservation: req.body.reservation,
                comment: req.body.comment,
                rating: req.body.rating
            };
            new archiveReservation_1.default(archiveData).save().then(ok => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Neuspesno dodavanje arhivirane rezervacije." });
            });
        };
        this.getAllArchiveReservations = (req, res) => {
            archiveReservation_1.default.find({}).then(reservations => {
                res.json(reservations);
            }).catch(err => {
                res.json(null);
            });
        };
        this.updateArchive = (req, res) => {
            const { reservation, comment, rating } = req.body;
            archiveReservation_1.default.updateOne({ reservation }, { $set: { comment, rating } }).then(result => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Neuspesno azuriranje rezervacije" });
            });
        };
    }
}
exports.ReservationController = ReservationController;
