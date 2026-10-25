import { Router } from "express";
import { DiscogsController } from "../controllers/discogs.controller.js";

const router = Router();

router.get("/search", DiscogsController.search);
router.get("/releases/:id", DiscogsController.getRelease);

export default router;
