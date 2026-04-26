import { Router } from 'express';
import CollectionController from '../controllers/collection.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
const CollectionRouter = Router();


CollectionRouter.post('/:albumId', AuthMiddleWare.checkToken, CollectionController.addAlbumToCollection);





export default CollectionRouter;