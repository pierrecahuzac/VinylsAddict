import { Router } from 'express';
import ConditionController from '../controllers/condition.controller.js';
import { AuthMiddleWare } from '../middleware/auth.middleware.js';
import { AdminMiddleWare } from '../middleware/admin.middleware.js';
const ConditionRouter = Router();

ConditionRouter.get('/', ConditionController.getAllConditions);
ConditionRouter.get('/:id', ConditionController.getConditionById);
ConditionRouter.post('/', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, ConditionController.createCondition);
ConditionRouter.put('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, ConditionController.updateCondition);
ConditionRouter.delete('/:id', AuthMiddleWare.checkToken, AdminMiddleWare.requireAdmin, ConditionController.deleteCondition);

export default ConditionRouter;
