import { Router } from 'express';
import MetadataController from '../controllers/metadata.controller.js';
const MetadataRouter = Router();



MetadataRouter.get('/getAllMetadatas', MetadataController.getAllMetadatas);



export default MetadataRouter;