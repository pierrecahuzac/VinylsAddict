import { VariantService } from "../services/variant.service.js";

const VariantController = {
  getAllVariants: async (req, res) => {
    try {
      const variants = await VariantService.getAll();
      return res.status(200).json(variants);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des variantes." });
    }
  },
  getVariantById: async (req, res) => {
    try {
      const variant = await VariantService.getById(req.params.id);
      if (!variant) {
        return res.status(404).json({ message: "Variante non trouvée." });
      }
      return res.status(200).json(variant);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération de la variante." });
    }
  },
  createVariant: async (req, res) => {
    try {
      const { nameEN, nameFR } = req.body;
      if (!nameEN) {
        return res.status(400).json({ message: "nameEN est requis." });
      }
      const variant = await VariantService.create(nameEN, nameFR);
      return res.status(201).json(variant);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Cette variante existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la création de la variante." });
    }
  },
  updateVariant: async (req, res) => {
    try {
      const { nameEN, nameFR } = req.body;
      const existing = await VariantService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Variante non trouvée." });
      }
      const variant = await VariantService.update(req.params.id, {
        nameEN: nameEN ?? existing.nameEN,
        nameFR: nameFR === undefined ? existing.nameFR : nameFR,
      });
      return res.status(200).json(variant);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Cette variante existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour de la variante." });
    }
  },
  deleteVariant: async (req, res) => {
    try {
      const existing = await VariantService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Variante non trouvée." });
      }
      await VariantService.delete(req.params.id);
      return res.status(200).json({ message: "Variante supprimée." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression de la variante." });
    }
  },
};

export default VariantController;
