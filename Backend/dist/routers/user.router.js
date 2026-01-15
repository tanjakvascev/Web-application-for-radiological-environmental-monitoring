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
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.route('/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new user_controller_1.UserController().login(req, res); }));
userRouter.route('/getAllUsers').get((req, res) => new user_controller_1.UserController().getAllUsers(req, res));
userRouter.route('/getUserByUsername/:username').get((req, res) => new user_controller_1.UserController().getUserByUsername(req, res));
userRouter.route('/getUserByName/:name').get((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new user_controller_1.UserController().getUserByName(req, res); }));
userRouter.route('/addNewUser').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new user_controller_1.UserController().addNewUser(req, res); }));
userRouter.route('/changePassword').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new user_controller_1.UserController().changePassword(req, res); }));
userRouter.route('/deleteUser').post((req, res) => new user_controller_1.UserController().deleteUser(req, res));
exports.default = userRouter;
