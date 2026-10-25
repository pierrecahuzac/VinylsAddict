import prisma from "../database/prismaClient.js";

const GenreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await prisma.genre.findMany({ include: { styles: true } });
      return res.status(200).json(genres);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des genres." });
    }
  },
  getGenreById: async (req, res) => {
    try {
      const genre = await prisma.genre.findUnique({
        where: { id: req.params.id },
        include: { styles: true },
      });
      if (!genre) {
        return res.status(404).json({ message: "Genre non trouvé." });
      }
      return res.status(200).json(genre);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération du genre." });
    }
  },
  createGenre: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "name est requis." });
      }
      const genre = await prisma.genre.create({ data: { name } });
      return res.status(201).json(genre);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Ce genre existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la création du genre." });
    }
  },
  updateGenre: async (req, res) => {
    try {
      const { name } = req.body;
      const existing = await prisma.genre.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return res.status(404).json({ message: "Genre non trouvé." });
      }
      const genre = await prisma.genre.update({
        where: { id: req.params.id },
        data: { name: name ?? existing.name },
      });
      return res.status(200).json(genre);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Ce genre existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour du genre." });
    }
  },
  deleteGenre: async (req, res) => {
    try {
      const existing = await prisma.genre.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return res.status(404).json({ message: "Genre non trouvé." });
      }
      await prisma.genre.delete({ where: { id: req.params.id } });
      return res.status(200).json({ message: "Genre supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression du genre." });
    }
  },
};

export default GenreController;
