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
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerificationEmail = (to, sample, examiner) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "tanja.kvascev@gmail.com",
            pass: "owvd dpde bufr qohe" // obavezno Google App Password!
        }
    });
    const mailOptions = {
        from: "tanja.kvascev@gmail.com",
        to: to,
        subject: "Novi izveštaj pristigao za verifikaciju",
        text: `Poštovani,

            Obaveštavamo Vas da je pristigao novi izveštaj za verifikaciju.

            Detalji uzorka:
            - Interna oznaka: ${sample.internID}
            - Naziv: ${sample.name}
            - Ispitivač: ${examiner.name}  ${examiner.lastname}

            Molimo Vas da izvršite pregled i verifikaciju izveštaja.

            Srdačan pozdrav,
            Automatski sistem radiološkog monitoringa
            `
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendVerificationEmail = sendVerificationEmail;
