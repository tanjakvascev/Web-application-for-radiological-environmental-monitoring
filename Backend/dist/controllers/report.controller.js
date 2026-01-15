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
exports.ReportController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pizzip_1 = __importDefault(require("pizzip"));
const docxtemplater_1 = __importDefault(require("docxtemplater"));
const emailController_1 = require("./emailController");
const report_1 = __importDefault(require("../models/report"));
const calculation_1 = __importDefault(require("../models/calculation"));
class ReportController {
    constructor() {
        this.getAllSamples = (req, res) => {
            report_1.default.find().then(reports => {
                res.json(reports);
            }).catch(err => {
                res.json(null);
            });
        };
        this.generateReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { sample, invoice, calculation, examiner, technicalMenager, technicalMenagerEmail } = req.body;
                const templatePath = path_1.default.join(__dirname, '../templates/EH25_D1_D3.docx');
                const content = fs_1.default.readFileSync(templatePath, 'binary');
                const zip = new pizzip_1.default(content);
                const doc = new docxtemplater_1.default(zip, { paragraphLoop: true, linebreaks: true });
                doc.render({
                    dateM: this.formatDate(sample.dateMeasure),
                    internIDnumber: sample.internID.split("/")[1],
                    requestNumber: invoice.requestNumber,
                    dateI: this.formatDate(invoice.date),
                    sampleNumber: sample.sampleID,
                    name: sample.name,
                    origin: sample.origin,
                    examiner: "dr " + examiner.name + " " + examiner.lastname,
                    technicalMenager: "dr " + technicalMenager,
                    resultK40: this.getIsotopeResult(calculation, "K-40"),
                    resultCs137: this.getIsotopeResult(calculation, "Cs-137"),
                });
                const buf = doc.getZip().generate({ type: 'nodebuffer' });
                const baseDir = path_1.default.join(__dirname, '../../reports', new Date().getFullYear().toString(), sample.internID);
                fs_1.default.mkdirSync(baseDir, { recursive: true });
                const wordPath = path_1.default.join(baseDir, 'report.docx');
                const pdfPath = path_1.default.join(baseDir, 'report.pdf');
                fs_1.default.writeFileSync(wordPath, buf);
                yield report_1.default.create({
                    internID: sample.internID,
                    examiner: `${examiner.name} ${examiner.lastname}`,
                    technicalMenager: technicalMenager,
                    date: new Date(),
                    isotopes: calculation.isotopes,
                    values: calculation.values,
                    errs: calculation.errs,
                    status: 'PENDING',
                    wordPath,
                    pdfPath
                });
                yield calculation_1.default.findOneAndDelete({
                    internID: calculation.internID
                });
                yield (0, emailController_1.sendVerificationEmail)(technicalMenagerEmail, sample, examiner);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Greška prilikom generisanja izveštaja');
            }
        });
        this.getWordReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, number } = req.params;
                const internID = id + "/" + number;
                const report = yield report_1.default.findOne({ internID });
                if (!report || !report.wordPath) {
                    return res.status(404).send('Izveštaj nije pronađen');
                }
                const fileName = `Izvestaj_${id}_${number}.docx`;
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.sendFile(report.wordPath);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Greška pri preuzimanju izveštaja');
            }
        });
        this.setStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { internID, status } = req.body;
                if (!internID || !status) {
                    return res.json({ message: 'Nedostaju podaci' });
                }
                const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
                if (!allowedStatuses.includes(status)) {
                    return res.json({ message: 'Nevalidan status' });
                }
                const report = yield report_1.default.findOneAndUpdate({ internID }, { status }, { new: true });
                if (!report) {
                    return res.json({ message: 'Izveštaj nije pronađen' });
                }
                res.json({ message: 'ok' });
            }
            catch (err) {
                console.error(err);
                res.json({ message: 'Greška na serveru' });
            }
        });
    }
    formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }
    getIsotopeResult(calc, isotopeName) {
        const index = calc.isotopes.indexOf(isotopeName);
        if (index === -1)
            return null;
        const value = calc.values[index];
        const err = calc.errs[index];
        if (err === -1) {
            return "< " + Math.round(value * 10) / 10;
        }
        else {
            return Math.round(value * 10) / 10 + " ± " + Math.round(err * 10) / 10;
            ;
        }
    }
}
exports.ReportController = ReportController;
