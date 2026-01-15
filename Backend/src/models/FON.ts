import mongoose from 'mongoose'

const FONSchema = new mongoose.Schema(
    {
        isotope: String,
        geometry: String,
        detector: String,
        FON: {type: [Number]}
    },{
      versionKey:false  
    }
);

export default mongoose.model('FONModel', FONSchema, 'FON');