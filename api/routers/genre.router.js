import { Router } from 'express';
import GenreController from '../controllers/genre.controller.js';
const GenreRouter = Router();

GenreRouter.get('/', GenreController.getAllGenres);

export default GenreRouter;