import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
const UserRouter = Router();



UserRouter.post('/login', UserController.login);
UserRouter.get('/', AuthMiddleWare.checkToken,UserController.getAllUsers);
UserRouter.get('/:id', AuthMiddleWare.checkToken,UserController.getById);
UserRouter.put('/:id/status', AuthMiddleWare.checkToken,UserController.changeAuthorizationToConnect);
UserRouter.put('/:id/role', AuthMiddleWare.checkToken,UserController.changeUserRole);

UserRouter.post('/logout', UserController.logout);
UserRouter.post('/signup', UserController.signup);
UserRouter.get('/role',AuthMiddleWare.checkToken, UserController.getUserRole)
UserRouter.post('/changePassword', AuthMiddleWare.checkToken, UserController.changePassword);
UserRouter.get('/checkToken', AuthMiddleWare.checkToken, UserController.checkToken);
UserRouter.get('/albums', AuthMiddleWare.checkToken, UserController.getAllUserAlbums);
UserRouter.get('/albums/:id', AuthMiddleWare.checkToken, UserController.getOneUserAlbum);
UserRouter.get('/albums/check/:id', AuthMiddleWare.checkToken, UserController.checkAlbumInCollection);



export default UserRouter;