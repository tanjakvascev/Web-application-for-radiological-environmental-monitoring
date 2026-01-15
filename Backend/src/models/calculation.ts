import mongoose from 'mongoose'

const CalculationSchema = new mongoose.Schema(
    {
        internID: String,
        isotopes: {type: [String]},
        values: {type: [Number]},
        errs: {type: [Number]},
        examiner: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('CalculationModel', CalculationSchema, 'calculations');