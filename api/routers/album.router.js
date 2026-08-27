import { Router } from 'express';
import AlbumController from '../controllers/album.controller.js';
const AlbumRouter = Router();

AlbumRouter.get('/', AlbumController.getAllAlbums);
AlbumRouter.post('/', AlbumController.create);
AlbumRouter.get('/:id', AlbumController.getOneAlbum);
AlbumRouter.put('/:id', AlbumController.update);
AlbumRouter.delete('/:id', AlbumController.delete);




export default AlbumRouter;