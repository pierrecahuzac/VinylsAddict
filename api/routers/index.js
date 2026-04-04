import { Router } from "express";
import GenreRouter from "./genre.router.js";
import AlbumRouter from "./album.router.js";
// import VinylRouter from "./vinyl.router.js"; // Futur exemple

const router = Router();
router.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API de Vinyls Addict" });
});
router.use("/genres", GenreRouter);
router.use("/albums", AlbumRouter);
// router.use("/vinyls", VinylRouter);

export default router;
