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
const sample_controller_1 = require("../controllers/sample.controller");
const sampleRouter = express_1.default.Router();
sampleRouter.route('/getAllSamples').get((req, res) => new sample_controller_1.SampleController().getAllSamples(req, res));
sampleRouter.route('/getSampleByInternID/:id/:number').get((req, res) => new sample_controller_1.SampleController().getSampleByInternID(req, res));
sampleRouter.route('/deleteSample').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new sample_controller_1.SampleController().deleteSample(req, res); }));
sampleRouter.route('/changeSampleName').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new sample_controller_1.SampleController().changeSampleName(req, res); }));
sampleRouter.route('/addSamples').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new sample_controller_1.SampleController().addSamples(req, res); }));
exports.default = sampleRouter;
