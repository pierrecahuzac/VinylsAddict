import { Router } from 'express';
import GenreController from '../controllers/genre.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
import { AdminMiddleWare } from '../middleware/admin.middleware.js';
const GenreRouter = Router();

GenreRouter.get('/', GenreController.getAllGenres);
GenreRouter.get('/:id', GenreController.getGenreById);
GenreRouter.post('/', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, GenreController.createGenre);
GenreRouter.put('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, GenreController.updateGenre);
GenreRouter.delete('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, GenreController.deleteGenre);

export default GenreRouter;
