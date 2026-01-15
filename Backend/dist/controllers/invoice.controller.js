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
exports.InvoiceController = void 0;
const invoice_1 = __importDefault(require("../models/invoice"));
class InvoiceController {
    constructor() {
        this.getAllInvoices = (req, res) => {
            invoice_1.default.find().then(invoices => {
                res.json(invoices);
            }).catch(err => {
                res.json(null);
            });
        };
        this.getInvoiceByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let internID = req.params.id + "/" + req.params.number;
                const invoices = yield invoice_1.default.find();
                const found = invoices.find(inv => this.isInRange(internID, inv.internIDs));
                if (found) {
                    return res.json(found);
                }
                else {
                    return res.json(null);
                }
            }
            catch (err) {
                res.json(null);
            }
        });
        this.saveInvoice = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const invoices = req.body;
                if (!Array.isArray(invoices) || invoices.length === 0) {
                    return res.json({ message: 'Nije prosleđena lista podataka.' });
                }
                yield invoice_1.default.insertMany(invoices);
                return res.json({ message: 'ok' });
            }
            catch (error) {
                return res.json({ message: 'Greška pri dodavanju podataka.' });
            }
        });
    }
    isInRange(internID, range) {
        const [prefix, numStr] = internID.split("/");
        const broj = parseInt(numStr);
        const [rangePrefix, rangeNums] = range.split("/");
        if (prefix !== rangePrefix)
            return false;
        const [startStr, endStr] = rangeNums.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        return broj >= start && broj <= end;
    }
}
exports.InvoiceController = InvoiceController;
