import { Router } from 'express';
import wishlistController from '../controllers/wishlist.controller.js';
const wishlistRouter = Router();

wishlistRouter.post('/:id', wishlistController.addAlbumToUserWishlist);




export default wishlistRouter;