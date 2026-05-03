import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
const UserRouter = Router();



UserRouter.post('/login', UserController.login);
UserRouter.post('/logout', UserController.logout);
UserRouter.post('/signup', UserController.signup);
UserRouter.post('/changePassword', AuthMiddleWare.checkToken, UserController.changePassword);
UserRouter.get('/checkToken', AuthMiddleWare.checkToken, UserController.checkToken);
UserRouter.get('/albums', AuthMiddleWare.checkToken, UserController.getAllUserAlbums);
UserRouter.get('/albums/:id', AuthMiddleWare.checkToken, UserController.getOneUserAlbum);
UserRouter.get('/albums/check/:id', AuthMiddleWare.checkToken, UserController.checkAlbumInCollection);



export default UserRouter;