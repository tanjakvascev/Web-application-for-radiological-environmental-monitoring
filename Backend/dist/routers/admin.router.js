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
const admin_controller_1 = require("../controllers/admin.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const adminRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profilePictures');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
adminRouter.route('/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new admin_controller_1.AdminController().login(req, res); }));
adminRouter.route('/deactivateAccount').post((req, res) => new admin_controller_1.AdminController().deactivateAccount(req, res));
adminRouter.route('/activateAccount').post((req, res) => new admin_controller_1.AdminController().activateAccount(req, res));
adminRouter.route('/approveRequest').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new admin_controller_1.AdminController().approveRequest(req, res); }));
adminRouter.route('/denyRequest').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new admin_controller_1.AdminController().denyRequest(req, res); }));
adminRouter.route('/getAllRequests').get((req, res) => new admin_controller_1.AdminController().getAllRequests(req, res));
adminRouter.route("/addUser").post(upload.single('profileImage'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield new admin_controller_1.AdminController().addUser(req, res);
}));
exports.default = adminRouter;
