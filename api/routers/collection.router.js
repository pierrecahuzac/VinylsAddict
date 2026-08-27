import { Router } from 'express';
import CollectionController from '../controllers/collection.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
const CollectionRouter = Router();


CollectionRouter.post('/:albumId', AuthMiddleWare.checkToken, CollectionController.addAlbumToCollection);
CollectionRouter.delete('/:userAlbumId', AuthMiddleWare.checkToken, CollectionController.deleteAlbumFromCollection);
CollectionRouter.post('/:userAlbumId/images', AuthMiddleWare.checkToken, upload.single('image'), CollectionController.addImageToUserAlbum);
CollectionRouter.delete('/:userAlbumId/images/:imageId', AuthMiddleWare.checkToken, CollectionController.deleteImageFromUserAlbum);





export default CollectionRouter;