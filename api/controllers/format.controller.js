import { FormatService } from "../services/format.service.js";

const FormatController = {
  getAllFormats: async (req, res) => {
    try {
      const formats = await FormatService.getAll();
      return res.status(200).json(formats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des formats." });
    }
  },
  getFormatById: async (req, res) => {
    try {
      const format = await FormatService.getById(req.params.id);
      if (!format) {
        return res.status(404).json({ message: "Format non trouvé." });
      }
      return res.status(200).json(format);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération du format." });
    }
  },
  createFormat: async (req, res) => {
    try {
      const { name, speed, description } = req.body;
      if (!name) {
        return res.status(400).json({ message: "name est requis." });
      }
      const format = await FormatService.create(name, speed, description);
      return res.status(201).json(format);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Ce format existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la création du format." });
    }
  },
  updateFormat: async (req, res) => {
    try {
      const { name, speed, description } = req.body;
      const existing = await FormatService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Format non trouvé." });
      }
      const format = await FormatService.update(req.params.id, {
        name: name ?? existing.name,
        speed: speed === undefined ? existing.speed : speed,
        description: description === undefined ? existing.description : description,
      });
      return res.status(200).json(format);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Ce format existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour du format." });
    }
  },
  deleteFormat: async (req, res) => {
    try {
      const existing = await FormatService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Format non trouvé." });
      }
      await FormatService.delete(req.params.id);
      return res.status(200).json({ message: "Format supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression du format." });
    }
  },
};

export default FormatController;
