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
exports.AdminController = void 0;
const admin_1 = __importDefault(require("../models/admin"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerRequest_1 = __importDefault(require("../models/registerRequest"));
const user_1 = __importDefault(require("../models/user"));
const rejectedCredentials_1 = __importDefault(require("../models/rejectedCredentials"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AdminController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const password = req.body.password;
            try {
                const user = yield admin_1.default.findOne({ username: username });
                if (!user) {
                    return res.json(null);
                }
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!isMatch) {
                    return res.json(null);
                }
                res.json(user);
            }
            catch (err) {
                res.json(null);
            }
        });
        this.approveRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, firstName, lastName, gender, address, phone, email, creditCard, cardType, role, active, profileImage } = req.body;
                const userExists = yield user_1.default.findOne({ username: username });
                if (userExists) {
                    return res.json({ message: "Korisnik sa datim korisnickim imenom vec postoji." });
                }
                const emailExists = yield user_1.default.findOne({ email: email });
                if (emailExists) {
                    return res.json({ message: "Korisnik sa datim mejlom vec postoji." });
                }
                const newUser = new user_1.default({
                    username,
                    password,
                    firstName,
                    lastName,
                    gender,
                    address,
                    phone,
                    email,
                    profileImage,
                    creditCard,
                    cardType,
                    role,
                    active
                });
                yield newUser.save();
                yield registerRequest_1.default.deleteOne({ username });
                res.json({ message: "ok" });
            }
            catch (err) {
                console.log(err);
                res.json({ message: "Greska pri registrovanju korisnika." });
            }
        });
        this.denyRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.body.admin;
                const request = req.body.request;
                const imagePath = request.profileImage;
                const absolutePath = path_1.default.join(__dirname, "../../", 'uploads', imagePath);
                yield registerRequest_1.default.deleteOne({ username: request.username });
                if (imagePath !== 'profilePictures/default.png') {
                    fs_1.default.unlink(absolutePath, err => {
                        if (err) {
                            return res.json({ message: "Greska prilikom brisanja slike" });
                        }
                    });
                }
                const newRejected = new rejectedCredentials_1.default({
                    username: request.username,
                    email: request.email
                });
                yield newRejected.save();
                return res.json({ message: "ok" });
            }
            catch (err) {
                return res.json({ message: "Greska prilikom odbijanja zahteva" });
            }
        });
        this.deactivateAccount = (req, res) => {
            user_1.default.updateOne({ username: req.body.username }, { active: false }).then(ok => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Neuspeno deaktiviranje korisnika" });
            });
        };
        this.activateAccount = (req, res) => {
            user_1.default.updateOne({ username: req.body.username }, { active: true }).then(ok => {
                res.json({ message: "ok" });
            }).catch(err => {
                res.json({ message: "Neuspeno aktiviranje korisnika" });
            });
        };
        this.getAllRequests = (req, res) => {
            registerRequest_1.default.find().then(requests => {
                res.json(requests);
            }).catch(err => {
                res.json(null);
            });
        };
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, firstName, lastName, gender, address, phone, email, creditCard, cardType, role } = req.body;
                const active = true;
                const userExists = yield user_1.default.findOne({ username: username });
                if (userExists) {
                    if (req.file && req.file.path) {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err)
                                console.error('Greška pri brisanju fajla:', err);
                        });
                    }
                    return res.json({ message: "Korisnik sa datim korisnickim imenom vec postoji." });
                }
                const emailExists = yield user_1.default.findOne({ email: email });
                if (emailExists) {
                    if (req.file && req.file.path) {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err)
                                console.error('Greška pri brisanju fajla:', err);
                        });
                    }
                    return res.json({ message: "Korisnik sa datim mejlom vec postoji." });
                }
                const usernameRejected = yield rejectedCredentials_1.default.findOne({ username: username });
                if (usernameRejected) {
                    if (req.file && req.file.path) {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err)
                                console.error('Greška pri brisanju fajla:', err);
                        });
                    }
                    return res.json({ message: "Zeljeno korisnicko ime je nedozvoljeno" });
                }
                const emailRejected = yield rejectedCredentials_1.default.findOne({ email: email });
                if (emailRejected) {
                    if (req.file && req.file.path) {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err)
                                console.error('Greška pri brisanju fajla:', err);
                        });
                    }
                    return res.json({ message: "Zeljeni mejl je nedozvoljen" });
                }
                let profileImagePath;
                if (req.file) {
                    profileImagePath = 'profilePictures/' + req.file.filename;
                }
                else {
                    profileImagePath = 'profilePictures/default.png';
                }
                const newUser = new user_1.default({
                    username,
                    password,
                    firstName,
                    lastName,
                    gender,
                    address,
                    phone,
                    email,
                    profileImage: profileImagePath,
                    creditCard,
                    cardType,
                    role,
                    active
                });
                yield newUser.save();
                res.json({ message: "ok" });
            }
            catch (err) {
                console.log(err);
                res.json({ message: "Greska pri registrovanju korisnika." });
            }
        });
    }
}
exports.AdminController = AdminController;
