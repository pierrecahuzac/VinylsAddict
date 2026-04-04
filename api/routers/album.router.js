import { Router } from 'express';
import AlbumController from '../controllers/album.controller.js';
const AlbumRouter = Router();



AlbumRouter.get('/getAll', AlbumController.getAllAlbums);



export default AlbumRouter;