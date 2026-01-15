import mongoose from 'mongoose'

const FONtimeSchema = new mongoose.Schema(
    {
      geometry: String,
      detector: String,
      value: Number
    },{
      versionKey:false  
    }
);

export default mongoose.model('FONtimeModel', FONtimeSchema, 'FONtime');