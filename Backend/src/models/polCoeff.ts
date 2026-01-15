import mongoose from 'mongoose'

const polCoeffSchema = new mongoose.Schema(
    {
      geometry: String,
      detector: String,
      values: {type: [Number]}
    },{
      versionKey:false  
    }
);

export default mongoose.model('polCoeffModel', polCoeffSchema, 'polCoeff');