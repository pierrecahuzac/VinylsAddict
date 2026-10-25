import { Router } from 'express';
import AlbumController from '../controllers/album.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';

const AlbumRouter = Router();

AlbumRouter.get('/', AlbumController.getAllAlbums);
AlbumRouter.post('/', AuthMiddleWare.checkToken, AlbumController.create);
AlbumRouter.get('/:id', AlbumController.getOneAlbum);
AlbumRouter.put('/:id', AuthMiddleWare.checkToken, AlbumController.update);
AlbumRouter.delete('/:id', AuthMiddleWare.checkToken, AlbumController.delete);

export default AlbumRouter;
