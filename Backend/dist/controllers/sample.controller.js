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
exports.SampleController = void 0;
const sample_1 = __importDefault(require("../models/sample"));
class SampleController {
    constructor() {
        this.getAllSamples = (req, res) => {
            sample_1.default.find().then(samples => {
                res.json(samples);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getSampleByInternID = (req, res) => {
            let internID = req.params.id + "/" + req.params.number;
            sample_1.default.findOne({ internID }).then(sample => {
                res.json(sample);
            }).catch(err => {
                res.json(null);
            });
        };
        this.deleteSample = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let internId = req.body;
                const deleted = yield sample_1.default.findOneAndDelete(internId);
                if (!deleted) {
                    return res.json({ message: 'Uzorak nije pronađen.' });
                }
                return res.json({ message: 'ok' });
            }
            catch (error) {
                return res.json({ message: 'Greška pri brisanju uzorka.' });
            }
        });
        this.changeSampleName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { internID, newName, username } = req.body;
                const sample = yield sample_1.default.findOne({ internID });
                if (!sample) {
                    return res.json({ message: "Uzorak sa datom internom oznakom nije pronađen!" });
                }
                sample.nameHistory.push({
                    oldValue: sample.name,
                    newValue: newName,
                    changedAt: new Date(),
                    changedBy: username
                });
                sample.name = newName;
                yield sample.save();
                return res.json({ message: "ok" });
            }
            catch (err) {
                res.json({ message: "Greška prilikom izmenene naziva uzorka." });
            }
        });
        this.addSamples = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const samples = req.body;
                if (!Array.isArray(samples) || samples.length === 0) {
                    return res.json({ message: 'Nije prosleđena lista uzoraka.' });
                }
                yield sample_1.default.insertMany(samples);
                return res.json({ message: 'ok' });
            }
            catch (error) {
                return res.json({ message: 'Greška pri dodavanju uzoraka.' });
            }
        });
    }
}
exports.SampleController = SampleController;
