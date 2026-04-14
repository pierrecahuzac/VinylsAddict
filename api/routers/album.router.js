import { Router } from 'express';
import AlbumController from '../controllers/album.controller.js';
const AlbumRouter = Router();

AlbumRouter.get('/', AlbumController.getAllAlbums);
AlbumRouter.post('/', AlbumController.create);
AlbumRouter.get('/:id', AlbumController.getOneAlbum);




export default AlbumRouter;