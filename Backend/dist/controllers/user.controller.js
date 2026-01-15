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
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES = '1h';
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield user_1.default.findOne({ username });
                if (!user) {
                    return res.json(null);
                }
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.json(null);
                }
                const payload = { sub: user._id, username: user.username };
                const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
                return res.status(200).json({
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        role: user.role
                    }
                });
            }
            catch (err) {
                return res.json(null);
            }
        });
        this.getAllUsers = (req, res) => {
            user_1.default.find().then(users => {
                res.json(users);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getUserByUsername = (req, res) => {
            let username = req.params.username;
            user_1.default.findOne({ username }).then(user => {
                res.json(user);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getUserByName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fullName = (_a = req.params.name) === null || _a === void 0 ? void 0 : _a.trim();
                if (!fullName) {
                    return res.status(400).json(null);
                }
                const parts = fullName.split(/\s+/);
                const name = parts[0];
                const lastname = parts.slice(1).join(' ');
                const user = yield user_1.default.findOne({
                    name: name,
                    lastname: lastname
                });
                res.json(user);
            }
            catch (err) {
                console.error(err);
                res.json(null);
            }
        });
        this.addNewUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, lastname, email, username, password, role } = req.body;
                const existingUser = yield user_1.default.findOne({ username });
                if (existingUser) {
                    return res.json({ message: 'Korisnik sa datim imenom već postoji.' });
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                const newUser = new user_1.default({
                    name,
                    lastname,
                    email,
                    username,
                    password: hashedPassword,
                    role
                });
                yield newUser.save();
                return res.json({ message: 'ok' });
            }
            catch (error) {
                return res.json({ message: 'Greška prilikom čuvanja korisnika.' });
            }
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, oldPassword, newPassword } = req.body;
                const user = yield user_1.default.findOne({ username });
                if (!user) {
                    return res.json({ message: "Korisnik sa datim korisničkim imenom nije pronađen." });
                }
                const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
                if (!isMatch) {
                    return res.json({ message: "Stara lozinka nije ispravna." });
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
                user.password = hashedPassword;
                yield user.save();
                return res.json({ message: "ok" });
            }
            catch (error) {
                return res.json({ message: "Greška prilikom promene lozinke." });
            }
        });
        this.deleteUser = (req, res) => {
            user_1.default.deleteOne(req.body).then(data => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Greška prilikom brisanja korisnika." });
            });
        };
    }
}
exports.UserController = UserController;
