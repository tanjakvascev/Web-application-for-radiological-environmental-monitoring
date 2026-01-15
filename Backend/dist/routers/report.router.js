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
const report_controller_1 = require("../controllers/report.controller");
const reportRouter = express_1.default.Router();
reportRouter.route('/getAllReports').get((req, res) => new report_controller_1.ReportController().getAllSamples(req, res));
reportRouter.route('/generateReport').post((req, res) => new report_controller_1.ReportController().generateReport(req, res));
reportRouter.route('/getWordReport/:id/:number').get((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new report_controller_1.ReportController().getWordReport(req, res); }));
reportRouter.route('/setStatus').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new report_controller_1.ReportController().setStatus(req, res); }));
exports.default = reportRouter;
