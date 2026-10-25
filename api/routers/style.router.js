import { Router } from 'express';
import StyleController from '../controllers/style.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
import { AdminMiddleWare } from '../middleware/admin.middleware.js';
const StyleRouter = Router();

StyleRouter.get('/', StyleController.getAllStyles);
StyleRouter.get('/:id', StyleController.getStyleById);
StyleRouter.post('/', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, StyleController.createStyle);
StyleRouter.put('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, StyleController.updateStyle);
StyleRouter.delete('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, StyleController.deleteStyle);

export default StyleRouter;
