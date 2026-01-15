import express from 'express'
import { UserController } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.route('/login').post(
    async (req, res)=>{await new UserController().login(req, res)}
)

userRouter.route('/getAllUsers').get(
   (req, res) => new UserController().getAllUsers(req, res)
)

userRouter.route('/getUserByUsername/:username').get(
   (req, res) => new UserController().getUserByUsername(req, res)
)

userRouter.route('/getUserByName/:name').get(
   async (req, res) => { await new UserController().getUserByName(req, res)}
)

userRouter.route('/addNewUser').post(
   async (req, res) => { await new UserController().addNewUser(req, res)}
)

userRouter.route('/changePassword').post(
   async (req, res) => { await new UserController().changePassword(req, res)}
)

userRouter.route('/deleteUser').post(
   (req, res) => new UserController().deleteUser(req, res)
)

export default userRouter;