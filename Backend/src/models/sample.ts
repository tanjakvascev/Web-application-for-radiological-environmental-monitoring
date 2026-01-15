import mongoose from 'mongoose'

const sampleSchema = new mongoose.Schema(
    {
        internID: String,
        sampleID: String,
        name: String,
        origin: String,
        dateReception: String,
        dateMeasure: String,
        type: String,
        note: String,
        user: String,
        geometry: String,
        detector: String,
        nameHistory: [
          {
            oldValue: String,
            newValue: String,
            changedAt: Date,
            changedBy: String,
          }
        ]
    },{
      versionKey:false  
    }
);

export default mongoose.model('SampleModel', sampleSchema, 'samples');