import { Router } from "express";
import { DiscogsController } from "../controllers/discogs.controller.js";

const router = Router();

router.get("/search", DiscogsController.search);
router.get("/releases/:id", DiscogsController.getRelease);
router.get("/image", DiscogsController.getImage);
router.get("/editions", DiscogsController.getEditions);

export default router;
