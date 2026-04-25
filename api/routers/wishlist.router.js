import { Router } from 'express';
import wishlistController from '../controllers/wishlist.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';

const wishlistRouter = Router();

wishlistRouter.post('/:id', AuthMiddleWare.checkToken,  wishlistController.addAlbumToUserWishlist);
wishlistRouter.delete('/:id', AuthMiddleWare.checkToken,  wishlistController.deleteAlbumFromUserWishlist);
wishlistRouter.get('/', AuthMiddleWare.checkToken,  wishlistController.getUserWishlist);
wishlistRouter.get('/albums/check/:id', AuthMiddleWare.checkToken, wishlistController.checkAlbumInWishlist);





export default wishlistRouter;