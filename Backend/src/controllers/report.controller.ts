import express from 'express';
import path from 'path';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { sendVerificationEmail } from './emailController';
import ReportModel from '../models/report';
import CalculationModel from "../models/calculation";

export class ReportController{

    getAllSamples = (req: express.Request, res: express.Response)=>{
        ReportModel.find().then(reports=>{
            res.json(reports)
        }).catch(err=>{
            res.json(null)
        })
    }

    formatDate(date: Date | string): string {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }

    getIsotopeResult(calc: any, isotopeName: string): string | null {
        const index = calc.isotopes.indexOf(isotopeName);
        if (index === -1) return null;

        const value = calc.values[index];
        const err = calc.errs[index];

        if (err === -1) {
            return "< " + Math.round(value * 10) / 10;
        } else {
            return Math.round(value * 10) / 10 + " ± " + Math.round(err * 10) / 10;;
        }
    }

    generateReport = async (req: express.Request, res: express.Response) => {
        try {
            const { sample, invoice, calculation, examiner, technicalMenager, technicalMenagerEmail } = req.body;

            const templatePath = path.join(__dirname, '../templates/EH25_D1_D3.docx');
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);

            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

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

            const baseDir = path.join(
            __dirname,
            '../../reports',
            new Date().getFullYear().toString(),
            sample.internID
            );

            fs.mkdirSync(baseDir, { recursive: true });

            const wordPath = path.join(baseDir, 'report.docx');
            const pdfPath = path.join(baseDir, 'report.pdf');

            fs.writeFileSync(wordPath, buf);

            await ReportModel.create({
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

            await CalculationModel.findOneAndDelete({
                internID: calculation.internID
            });

            await sendVerificationEmail(
                technicalMenagerEmail,  
                sample,
                examiner
            );

        } catch (err) {
            console.error(err);
            res.status(500).send('Greška prilikom generisanja izveštaja');
        }
    };

    getWordReport = async (req: express.Request, res: express.Response) => {
        try {
            const { id, number } = req.params;
            const internID = id + "/" + number;

            const report = await ReportModel.findOne({ internID });

            if (!report || !report.wordPath) {
            return res.status(404).send('Izveštaj nije pronađen');
            }
            const fileName = `Izvestaj_${id}_${number}.docx`;
            res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
            );
            res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            );
            res.sendFile(report.wordPath);
        } catch (err) {
            console.error(err);
            res.status(500).send('Greška pri preuzimanju izveštaja');
        }
    };

    setStatus = async (req: express.Request, res: express.Response) => {
    try {
        const { internID, status } = req.body;

        if (!internID || !status) {
        return res.json({ message: 'Nedostaju podaci' });
        }

        const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (!allowedStatuses.includes(status)) {
        return res.json({ message: 'Nevalidan status' });
        }

        const report = await ReportModel.findOneAndUpdate(
        { internID },
        { status },
        { new: true }
        );

        if (!report) {
        return res.json({ message: 'Izveštaj nije pronađen' });
        }

        res.json({message: 'ok'});
    } catch (err) {
        console.error(err);
        res.json({ message: 'Greška na serveru' });
    }
    };

}