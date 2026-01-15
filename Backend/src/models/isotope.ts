import mongoose from 'mongoose'

const isotopeSchema = new mongoose.Schema(
    {
        name: String,
        energy: {type: [Number]},
        Ia: {type: [Number]}
    },{
      versionKey:false  
    }
);

export default mongoose.model('IsotopeModel', isotopeSchema, 'isotopes');