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
exports.CabinController = void 0;
const cabin_1 = __importDefault(require("../models/cabin"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CabinController {
    constructor() {
        this.newCabin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield cabin_1.default.findOne({ name: req.body.name });
                if (existing) {
                    return res.json({ message: "Vikendica sa datim imenom vec postoji." });
                }
                let priceList = JSON.parse(req.body.priceList);
                let galleryPaths = [];
                if (Array.isArray(req.files) && req.files.length > 0) {
                    galleryPaths = req.files.map(file => `${req.body.name}/${file.filename}`);
                }
                else {
                    galleryPaths = [];
                }
                const newCabin = new cabin_1.default({
                    host: req.body.host,
                    name: req.body.name,
                    location: req.body.location,
                    services: req.body.services,
                    priceList: priceList,
                    phone: req.body.phone,
                    latitude: parseFloat(req.body.latitude),
                    longitude: parseFloat(req.body.longitude),
                    ratings: req.body.ratings || [],
                    comments: req.body.comments || [],
                    gallery: galleryPaths
                });
                yield newCabin.save();
                res.json({ message: "ok" });
            }
            catch (err) {
                res.json({ message: "Neuspeno dodavanje vikendice" });
            }
        });
        this.getAllCabinsByHost = (req, res) => {
            cabin_1.default.find({ host: req.query.username }).then(cabins => {
                res.json(cabins);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getAllCabins = (req, res) => {
            cabin_1.default.find().then(cabins => {
                res.json(cabins);
            }).catch(err => {
                res.json(null);
            });
        };
        this.search = (req, res) => {
            const name = req.query.name;
            const location = req.query.location;
            const filter = {};
            if (name) {
                filter.name = { $regex: name, $options: 'i' };
            }
            if (location) {
                filter.location = { $regex: location, $options: 'i' };
            }
            cabin_1.default.find(filter).then(cabins => {
                res.json(cabins);
            }).catch(err => {
                res.json(null);
            });
        };
        this.updateCabin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.oldName != req.body.name) {
                    const existing = yield cabin_1.default.findOne({ name: req.body.name });
                    if (existing) {
                        return res.json({ message: "Vikendica sa datim imenom vec postoji." });
                    }
                }
                const cabin = yield cabin_1.default.findOne({ name: req.body.name });
                if (!cabin) {
                    return res.json({ message: "Vikendica nije pronađena." });
                }
                const oldImages = JSON.parse(req.body.deleteOld);
                cabin.gallery = cabin.gallery.filter(img => !oldImages.includes(img));
                for (let img of oldImages) {
                    const filePath = path_1.default.join('uploads', img);
                    fs_1.default.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Greška prilikom brisanja slike:", img, err.message);
                        }
                    });
                }
                let priceList = JSON.parse(req.body.priceList);
                let galleryPaths = [];
                if (Array.isArray(req.files) && req.files.length > 0) {
                    galleryPaths = req.files.map(file => `${req.body.name}/${file.filename}`);
                }
                else {
                    galleryPaths = [];
                }
                cabin.gallery.push(...galleryPaths);
                cabin.host = req.body.host;
                cabin.name = req.body.name;
                cabin.location = req.body.location;
                cabin.services = req.body.services;
                cabin.priceList = priceList;
                cabin.phone = req.body.phone;
                cabin.latitude = parseFloat(req.body.latitude);
                cabin.longitude = parseFloat(req.body.longitude);
                cabin.ratings = req.body.ratings;
                cabin.comments = req.body.comments;
                const result = yield cabin_1.default.updateOne({ name: req.body.oldName }, { $set: cabin });
                if (result.modifiedCount === 0) {
                    return res.json({ message: "Izmenite neko polje!" });
                }
                else {
                    return res.json({ message: "ok" });
                }
            }
            catch (err) {
                return res.json({ message: "Greska prilikom azuriranja" });
            }
        });
        this.getCabinByName = (req, res) => {
            cabin_1.default.findOne({ name: req.query.name }).then(cabin => {
                res.json(cabin);
            }).catch(err => {
                console.log(err);
            });
        };
        this.deleteCabin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield cabin_1.default.deleteOne({ name: req.body.name });
                if (result.deletedCount === 0) {
                    return res.json({ message: "Vikendica nije pronađena." });
                }
                const folderPath = path_1.default.join('uploads', req.body.name);
                if (fs_1.default.existsSync(folderPath)) {
                    fs_1.default.rmSync(folderPath, { recursive: true, force: true });
                }
                res.json({ message: "ok" });
            }
            catch (err) {
                res.json({ message: "Greska prilikom brisanja vikendice" });
            }
        });
        this.addCommentAndRating = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cabin = yield cabin_1.default.findOne({ name: req.body.name });
                if (!cabin) {
                    return res.json({ message: "Vikendica nije pronađena" });
                }
                cabin.comments.push(req.body.comment);
                cabin.ratings.push(req.body.rating);
                yield cabin.save();
                res.json({ message: "ok" });
            }
            catch (err) {
                res.json({ message: "Greksa prilikom dodavanja komentara i ocene" });
            }
        });
    }
}
exports.CabinController = CabinController;
