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
const invoice_controller_1 = require("../controllers/invoice.controller");
const invoiceRouter = express_1.default.Router();
invoiceRouter.route('/getAllInvoices').get((req, res) => new invoice_controller_1.InvoiceController().getAllInvoices(req, res));
invoiceRouter.route('/getInvoiceByID/:id/:number').get((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new invoice_controller_1.InvoiceController().getInvoiceByID(req, res); }));
invoiceRouter.route('/saveInvoice').post((req, res) => __awaiter(void 0, void 0, void 0, function* () { yield new invoice_controller_1.InvoiceController().saveInvoice(req, res); }));
exports.default = invoiceRouter;
