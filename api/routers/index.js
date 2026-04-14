import { Router } from "express";
import GenreRouter from "./genre.router.js";
import AlbumRouter from "./album.router.js";
import UserRouter from "./user.router.js";
import MetadataRouter from "./metadata.router.js";
import wishlistRouter from "./wishlist.router.js";


const router = Router();
router.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API de Vinyls Addict" });
});
router.use("/genres", GenreRouter);
router.use("/albums", AlbumRouter);
router.use("/users", UserRouter);
router.use("/metadatas", MetadataRouter);
router.use("/wishlists", wishlistRouter);


export default router;
