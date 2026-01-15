import express from 'express';
import UserModel from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES = '1h';

export class UserController{

    login = async(req: express.Request, res: express.Response) => {
        try {
            const { username, password } = req.body;

            const user = await UserModel.findOne({ username });
            if (!user) {
                return res.json(null);
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json(null);
            }

            const payload = { sub: user._id, username: user.username };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (err) {
            return res.json(null);
        }
    }

    getAllUsers = (req: express.Request, res: express.Response) => {
       UserModel.find().then(users=>{
            res.json(users)
        }).catch(err=>{
            res.json(null)
        })
    }

    getUserByUsername = (req: express.Request, res: express.Response) => {
        let username = req.params.username;
        UserModel.findOne({username}).then(user=>{
            res.json(user)
        }).catch(err=>{
            res.json(null)
        })
    }

    getUserByName = async (req: express.Request, res: express.Response) => {
        try {
            const fullName = req.params.name?.trim();

            if (!fullName) {
            return res.status(400).json(null);
            }

            const parts = fullName.split(/\s+/);

            const name = parts[0];
            const lastname = parts.slice(1).join(' ');

            const user = await UserModel.findOne({
            name: name,
            lastname: lastname
            });

            res.json(user);
        } catch (err) {
            console.error(err);
            res.json(null);
        }
    }

    addNewUser = async (req: express.Request, res: express.Response) => {
        try {
            const { name, lastname, email, username, password, role } = req.body;

            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return res.json({ message: 'Korisnik sa datim imenom već postoji.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new UserModel({
                name, 
                lastname,
                email,
                username,
                password: hashedPassword,
                role
            });

            await newUser.save();

            return res.json({ message: 'ok' });
        } catch (error) {
            return res.json({ message: 'Greška prilikom čuvanja korisnika.' });
        }
    };

    changePassword = async (req: express.Request, res: express.Response) => {
        try {
            const { username, oldPassword, newPassword } = req.body;

            const user = await UserModel.findOne({ username });

            if (!user) {
            return res.json({ message: "Korisnik sa datim korisničkim imenom nije pronađen." });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return res.json({ message: "Stara lozinka nije ispravna." });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
            await user.save();

            return res.json({ message: "ok" });

        } catch (error) {
            return res.json({ message: "Greška prilikom promene lozinke." });
        }
    };

    deleteUser = (req: express.Request, res: express.Response) => {
       UserModel.deleteOne(req.body).then(data=>{
            res.json({message: "ok"})
        }).catch(err=>{
            res.json({message: "Greška prilikom brisanja korisnika."})
        })
    }
}