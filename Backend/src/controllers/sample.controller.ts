import express from 'express';
import SampleModel from '../models/sample';

export class SampleController{

    getAllSamples = (req: express.Request, res: express.Response)=>{
        SampleModel.find().then(samples=>{
            res.json(samples)
        }).catch(err=>{
           res.json(null)
        })
    }

    getSampleByInternID = (req: express.Request, res: express.Response)=>{
      let internID = req.params.id + "/" + req.params.number;
      SampleModel.findOne({internID}).then(sample=>{
          res.json(sample)
      }).catch(err=>{
          res.json(null)
      })
    }

    deleteSample = async (req: express.Request, res: express.Response)=>{
        try {
            let internId = req.body;
            const deleted = await SampleModel.findOneAndDelete(internId);

            if (!deleted) {
            return res.json({ message: 'Uzorak nije pronađen.' });
            }

            return res.json({ message: 'ok' });
        } catch (error) {
            return res.json({ message: 'Greška pri brisanju uzorka.' });
        }
    }

    changeSampleName = async (req: express.Request, res: express.Response)=>{
        try {
        const { internID, newName, username } = req.body;

        const sample = await SampleModel.findOne({ internID });

        if (!sample) {
          return res.json({ message: "Uzorak sa datom internom oznakom nije pronađen!" });
        }

        sample.nameHistory.push({
          oldValue: sample.name,
          newValue: newName,
          changedAt: new Date(),
          changedBy: username
        });

        sample.name = newName;

        await sample.save();

        return res.json({ message: "ok" });

      } catch (err) {
        res.json({ message: "Greška prilikom izmenene naziva uzorka." });
      }
    }

    addSamples = async (req: express.Request, res: express.Response) => {
    try {
      const samples = req.body;

      if (!Array.isArray(samples) || samples.length === 0) {
        return res.json({ message: 'Nije prosleđena lista uzoraka.' });
      }

      await SampleModel.insertMany(samples);

      return res.json({message: 'ok'});
    } catch (error) {
      return res.json({ message: 'Greška pri dodavanju uzoraka.' });
    }
  };

}