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
const isotope_controller_1 = require("../controllers/isotope.controller");
const isotopeRouter = express_1.default.Router();
isotopeRouter.route('/getAllIsotopes').get((req, res) => new isotope_controller_1.IsotopeController().getAllIsotopes(req, res));
isotopeRouter.route('/getPolCoeffs').get((req, res) => new isotope_controller_1.IsotopeController().getPolCoeffs(req, res));
isotopeRouter.route('/getFONtime').get((req, res) => new isotope_controller_1.IsotopeController().getFONtime(req, res));
isotopeRouter.route('/getFON').get((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new isotope_controller_1.IsotopeController().getFON(req, res); }));
isotopeRouter.route('/saveCalculation').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new isotope_controller_1.IsotopeController().saveCalculation(req, res); }));
isotopeRouter.route('/getAllCalculations').get((req, res) => new isotope_controller_1.IsotopeController().getAllCalculations(req, res));
isotopeRouter.route('/getCalculationByInternID/:id/:number').get((req, res) => new isotope_controller_1.IsotopeController().getCalculationByInternID(req, res));
exports.default = isotopeRouter;
