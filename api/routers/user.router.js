import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
const UserRouter = Router();



UserRouter.post('/login', UserController.login);
UserRouter.post('/logout', UserController.logout);
UserRouter.post('/signup', UserController.signup);
UserRouter.get('/checkToken', UserController.checkToken);




export default UserRouter;