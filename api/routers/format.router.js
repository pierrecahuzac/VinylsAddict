import { Router } from 'express';
import FormatController from '../controllers/format.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
import { AdminMiddleWare } from '../middleware/admin.middleware.js';
const FormatRouter = Router();

FormatRouter.get('/', FormatController.getAllFormats);
FormatRouter.get('/:id', FormatController.getFormatById);
FormatRouter.post('/', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, FormatController.createFormat);
FormatRouter.put('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, FormatController.updateFormat);
FormatRouter.delete('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, FormatController.deleteFormat);

export default FormatRouter;
