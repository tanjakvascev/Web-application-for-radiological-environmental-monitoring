import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user';

//npm run hash-passwords

mongoose.connect('mongodb://localhost:27017/Laboratorija060')
  .then(async () => {
    console.log("Povezan na bazu...");

    const users = await UserModel.find();
    for (const user of users) {
      if (user.password.length < 11) { 
        console.log(`Heširam lozinku za: ${user.username}`);

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(user.password, salt);
        user.password = hashed;

        await user.save();
      }
    }

    console.log("Završeno heširanje.");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
