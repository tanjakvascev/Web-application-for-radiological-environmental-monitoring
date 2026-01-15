import mongoose from 'mongoose'
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
      name: String,
      lastname: String,
      email: String,
      username: String,
      password: {type: String, required: true}, 
      role: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('UserModel', userSchema, 'users');