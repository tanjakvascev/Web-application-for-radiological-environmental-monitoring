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
const cabin_controller_1 = require("../controllers/cabin.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cabinRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const cabinName = req.body.name;
        const uploadPath = path_1.default.join('uploads', cabinName);
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
cabinRouter.post("/newCabin", upload.array('images'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield new cabin_controller_1.CabinController().newCabin(req, res);
}));
cabinRouter.route("/getAllCabinsByHost").get((req, res) => new cabin_controller_1.CabinController().getAllCabinsByHost(req, res));
cabinRouter.route("/getAllCabins").get((req, res) => new cabin_controller_1.CabinController().getAllCabins(req, res));
cabinRouter.route("/search").get((req, res) => new cabin_controller_1.CabinController().search(req, res));
cabinRouter.route("/deleteCabin").post((req, res) => new cabin_controller_1.CabinController().deleteCabin(req, res));
cabinRouter.post("/updatecabin", upload.array('images'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield new cabin_controller_1.CabinController().updateCabin(req, res);
}));
cabinRouter.route("/getCabinByName").get((req, res) => new cabin_controller_1.CabinController().getCabinByName(req, res));
cabinRouter.route("/addCommentAndRating").post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new cabin_controller_1.CabinController().addCommentAndRating(req, res); }));
exports.default = cabinRouter;
