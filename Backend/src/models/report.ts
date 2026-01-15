import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
    {
      internID: String,
      examiner: String,
      technicalMenager: String,
      date: Date,
      isotopes: {type: [String]},
      values: {type: [Number]},
      errs: {type: [Number]},
      status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
      },

      wordPath: String,
      pdfPath: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('reportModel', reportSchema, 'reports');