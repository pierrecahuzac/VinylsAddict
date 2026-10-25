import { StyleService } from "../services/style.service.js";

const StyleController = {
  getAllStyles: async (req, res) => {
    try {
      const styles = await StyleService.getAll();
      return res.status(200).json(styles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des styles." });
    }
  },
  getStyleById: async (req, res) => {
    try {
      const style = await StyleService.getById(req.params.id);
      if (!style) {
        return res.status(404).json({ message: "Style non trouvé." });
      }
      return res.status(200).json(style);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération du style." });
    }
  },
  createStyle: async (req, res) => {
    try {
      const { name, genreId } = req.body;
      if (!name || !genreId) {
        return res.status(400).json({ message: "name et genreId sont requis." });
      }
      const style = await StyleService.create(name, genreId);
      return res.status(201).json(style);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Ce style existe déjà." });
      }
      if (error?.code === "P2025") {
        return res.status(404).json({ message: "Genre introuvable." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la création du style." });
    }
  },
  updateStyle: async (req, res) => {
    try {
      const { name, genreId } = req.body;
      const existing = await StyleService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Style non trouvé." });
      }
      const data = {};
      if (name !== undefined) data.name = name;
      if (genreId !== undefined) data.genre = { connect: { id: genreId } };
      const style = await StyleService.update(req.params.id, data);
      return res.status(200).json(style);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Ce style existe déjà." });
      }
      if (error?.code === "P2025") {
        return res.status(404).json({ message: "Genre introuvable." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour du style." });
    }
  },
  deleteStyle: async (req, res) => {
    try {
      const existing = await StyleService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Style non trouvé." });
      }
      await StyleService.delete(req.params.id);
      return res.status(200).json({ message: "Style supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression du style." });
    }
  },
};

export default StyleController;
