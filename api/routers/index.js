import { Router } from "express";
//import rateLimit from 'express-rate-limit';

import GenreRouter from "./genre.router.js";
import AlbumRouter from "./album.router.js";
import UserRouter from "./user.router.js";
import MetadataRouter from "./metadata.router.js";
import wishlistRouter from "./wishlist.router.js";
import CollectionRouter from "./collection.router.js";

const router = Router();
const isDev = process.env.NODE_ENV === "development";

// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: isDev ? 2 : 100, 
//   standardHeaders: true, 
//   legacyHeaders: false, 
//   handler: (req, res, next, options) => {
//     if (isDev) {

//       return res.status(429).json({
//         error: "Too Many Requests (Local Dev Mode)",
//         message: "Tu as dépassé la limite de requêtes en local.",
//         clientIp: req.ip,
//         limit: options.max,
//         windowMs: options.windowMs
//       });
//     }


//     return res.status(429).json({
//       message: "Trop de requêtes depuis cette IP, réessayez plus tard."
//     });
//   }
// });

// router.use(globalLimiter);

router.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API de Vinyls Addict" });
});

router.use("/api/genres", GenreRouter);
router.use("/api/albums", AlbumRouter);
router.use("/api/collections", CollectionRouter);
router.use("/api/users", UserRouter);
router.use("/api/metadatas", MetadataRouter);
router.use("/api/wishlists", wishlistRouter);

export default router;