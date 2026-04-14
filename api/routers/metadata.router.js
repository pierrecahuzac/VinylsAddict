import { Router } from 'express';
import MetadataController from '../controllers/metadata.controller.js';
const MetadataRouter = Router();



MetadataRouter.get('/', MetadataController.getAllMetadatas);



export default MetadataRouter;