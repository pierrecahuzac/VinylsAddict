import { GenreService } from "../services/genre.service.js";

const GenreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await GenreService.getAll();
      return res.status(200).json(genres);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des genres." });
    }
  },
  getGenreById: async (req, res) => {
    try {
      const genre = await GenreService.getById(req.params.id);
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
      const genre = await GenreService.create(name);
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
      const existing = await GenreService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Genre non trouvé." });
      }
      const genre = await GenreService.update(req.params.id, name ?? existing.name);
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
      const existing = await GenreService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Genre non trouvé." });
      }
      await GenreService.delete(req.params.id);
      return res.status(200).json({ message: "Genre supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression du genre." });
    }
  },
};

export default GenreController;
