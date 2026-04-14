import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
const UserRouter = Router();



UserRouter.post('/login', UserController.login);
UserRouter.post('/logout', AuthMiddleWare.checkToken,UserController.logout);
UserRouter.post('/signup', UserController.signup);
UserRouter.get('/checkToken', AuthMiddleWare.checkToken, UserController.checkToken);
UserRouter.get('/albums', AuthMiddleWare.checkToken, UserController.getAllUserAlbums);
UserRouter.get('/albums/:id', AuthMiddleWare.checkToken, UserController.getUserAlbums);



export default UserRouter;