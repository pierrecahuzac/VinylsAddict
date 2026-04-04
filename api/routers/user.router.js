import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
const UserRouter = Router();



UserRouter.post('/login', UserController.login);
UserRouter.post('/signup', UserController.signup);



export default UserRouter;