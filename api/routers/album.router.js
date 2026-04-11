import { Router } from 'express';
import AlbumController from '../controllers/album.controller.js';
const AlbumRouter = Router();

AlbumRouter.get('/getAllAlbums', AlbumController.getAllAlbums);
AlbumRouter.get('/getAllUserAlbums', AlbumController.getAllUserAlbums);
AlbumRouter.get('/getOneAlbum/:id', AlbumController.getOneAlbum);
AlbumRouter.get('/getUserAlbum/:id', AlbumController.getUserAlbum);
AlbumRouter.get('/addAlbumToUserWishlist/:id', AlbumController.addAlbumToUserWishlist);
AlbumRouter.post('/create', AlbumController.create);



export default AlbumRouter;