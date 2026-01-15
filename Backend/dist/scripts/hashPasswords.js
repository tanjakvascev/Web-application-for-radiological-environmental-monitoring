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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
//npm run hash-passwords
mongoose_1.default.connect('mongodb://localhost:27017/Laboratorija060')
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Povezan na bazu...");
    const users = yield user_1.default.find();
    for (const user of users) {
        if (user.password.length < 11) {
            console.log(`Heširam lozinku za: ${user.username}`);
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashed = yield bcryptjs_1.default.hash(user.password, salt);
            user.password = hashed;
            yield user.save();
        }
    }
    console.log("Završeno heširanje.");
    process.exit();
}))
    .catch(err => {
    console.error(err);
    process.exit(1);
});
