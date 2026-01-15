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
exports.IsotopeController = void 0;
const isotope_1 = __importDefault(require("../models/isotope"));
const polCoeff_1 = __importDefault(require("../models/polCoeff"));
const FONtime_1 = __importDefault(require("../models/FONtime"));
const FON_1 = __importDefault(require("../models/FON"));
const calculation_1 = __importDefault(require("../models/calculation"));
class IsotopeController {
    constructor() {
        this.getAllIsotopes = (req, res) => {
            isotope_1.default.find().then(isotopes => {
                res.json(isotopes);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getPolCoeffs = (req, res) => {
            const { geometry, detector } = req.query;
            polCoeff_1.default.findOne({ geometry, detector }).then(coeffs => {
                res.json(coeffs);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getFONtime = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { geometry, detector } = req.query;
            FONtime_1.default.findOne({ geometry, detector }).then(FONtime => {
                res.json(FONtime);
            }).catch(err => {
                res.json(null);
            });
        });
        this.getFON = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { geometry, detector } = req.query;
                if (!geometry || !detector) {
                    return res.json(null);
                }
                const fonList = yield FON_1.default.find({ geometry, detector });
                if (!fonList || fonList.length === 0) {
                    return res.json(null);
                }
                return res.json(fonList);
            }
            catch (err) {
                return res.json(null);
            }
        });
        this.saveCalculation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const calculationData = req.body;
                const newCalculation = new calculation_1.default(calculationData);
                yield newCalculation.save();
                res.json({ message: "ok" });
            }
            catch (error) {
                res.json({ message: "Greška prilikom čuvanja u bazi." });
            }
        });
        this.getAllCalculations = (req, res) => {
            calculation_1.default.find().then(calculations => {
                res.json(calculations);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getCalculationByInternID = (req, res) => {
            let internID = req.params.id + "/" + req.params.number;
            calculation_1.default.findOne({ internID }).then(calculation => {
                res.json(calculation);
            }).catch(err => {
                res.json(null);
            });
        };
    }
}
exports.IsotopeController = IsotopeController;
