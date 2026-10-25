import { Router } from 'express';
import VariantController from '../controllers/variant.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
import { AdminMiddleWare } from '../middleware/admin.middleware.js';
const VariantRouter = Router();

VariantRouter.get('/', VariantController.getAllVariants);
VariantRouter.get('/:id', VariantController.getVariantById);
VariantRouter.post('/', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, VariantController.createVariant);
VariantRouter.put('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, VariantController.updateVariant);
VariantRouter.delete('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, VariantController.deleteVariant);

export default VariantRouter;
