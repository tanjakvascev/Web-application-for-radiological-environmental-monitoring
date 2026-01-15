import express from 'express';
import IsotopeModel from '../models/isotope';
import polCoeffModel from '../models/polCoeff';
import FONtimeModel from '../models/FONtime';
import FONModel from '../models/FON';
import calculationModel from '../models/calculation';

export class IsotopeController{

    getAllIsotopes = (req: express.Request, res: express.Response)=>{
        IsotopeModel.find().then(isotopes=>{
            res.json(isotopes)
        }).catch(err=>{
           res.json(null)
        })
    }

    getPolCoeffs = (req: express.Request, res: express.Response)=>{
        const { geometry, detector } = req.query;
        polCoeffModel.findOne({ geometry, detector }).then(coeffs=>{
            res.json(coeffs)
        }).catch(err=>{
           res.json(null)
        })
    }

    getFONtime = async (req: express.Request, res: express.Response) => {
        const { geometry, detector } = req.query;
        FONtimeModel.findOne({ geometry, detector }).then(FONtime=>{
            res.json(FONtime)
        }).catch(err=>{
           res.json(null)
        })
    };

    getFON = async (req: express.Request, res: express.Response) => {
        try {
            const { geometry, detector } = req.query;

            if (!geometry || !detector) {
            return res.json(null);
            }

            const fonList = await FONModel.find({ geometry, detector });

            if (!fonList || fonList.length === 0) {
            return res.json(null);
            }

            return res.json(fonList);
        } catch (err) {
            return res.json(null);
        }
    };

    saveCalculation = async (req: express.Request, res: express.Response) => {
        try {
            const calculationData = req.body;

            const newCalculation = new calculationModel(calculationData);

            await newCalculation.save();

            res.json({ message: "ok" });
        } catch (error) {
            res.json({ message: "Greška prilikom čuvanja u bazi." });
        }
    };

    getAllCalculations = (req: express.Request, res: express.Response)=>{
        calculationModel.find().then(calculations=>{
            res.json(calculations)
        }).catch(err=>{
           res.json(null)
        })
    }

    getCalculationByInternID = (req: express.Request, res: express.Response)=>{
        let internID = req.params.id + "/" + req.params.number;
        calculationModel.findOne({internID}).then(calculation=>{
            res.json(calculation)
        }).catch(err=>{
            res.json(null)
        })
    }
}