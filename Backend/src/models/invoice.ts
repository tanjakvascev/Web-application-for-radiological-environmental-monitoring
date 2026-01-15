import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
    {
        date: String,
        requestNumber: Number,
        internIDs: String,
        sampleNumber: Number,
        comment: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('invoiceModel', invoiceSchema, 'invoices');