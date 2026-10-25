import prisma from "../database/prismaClient.js";

const StyleController = {
  getAllStyles: async (req, res) => {
    try {
      const styles = await prisma.style.findMany({ include: { genre: true } });
      return res.status(200).json(styles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des styles." });
    }
  },
  getStyleById: async (req, res) => {
    try {
      const style = await prisma.style.findUnique({
        where: { id: req.params.id },
        include: { genre: true },
      });
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
      const style = await prisma.style.create({
        data: { name, genre: { connect: { id: genreId } } },
      });
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
      const existing = await prisma.style.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return res.status(404).json({ message: "Style non trouvé." });
      }
      const data = {};
      if (name !== undefined) data.name = name;
      if (genreId !== undefined) data.genre = { connect: { id: genreId } };
      const style = await prisma.style.update({
        where: { id: req.params.id },
        data,
      });
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
      const existing = await prisma.style.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        return res.status(404).json({ message: "Style non trouvé." });
      }
      await prisma.style.delete({ where: { id: req.params.id } });
      return res.status(200).json({ message: "Style supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression du style." });
    }
  },
};

export default StyleController;
