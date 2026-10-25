import { ConditionService } from "../services/condition.service.js";

const ConditionController = {
  getAllConditions: async (req, res) => {
    try {
      const conditions = await ConditionService.getAll();
      return res.status(200).json(conditions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des conditions." });
    }
  },
  getConditionById: async (req, res) => {
    try {
      const condition = await ConditionService.getById(req.params.id);
      if (!condition) {
        return res.status(404).json({ message: "Condition non trouvée." });
      }
      return res.status(200).json(condition);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération de la condition." });
    }
  },
  createCondition: async (req, res) => {
    try {
      const { nameEN, nameFR } = req.body;
      if (!nameEN) {
        return res.status(400).json({ message: "nameEN est requis." });
      }
      const condition = await ConditionService.create(nameEN, nameFR);
      return res.status(201).json(condition);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Cette condition existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la création de la condition." });
    }
  },
  updateCondition: async (req, res) => {
    try {
      const { nameEN, nameFR } = req.body;
      const existing = await ConditionService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Condition non trouvée." });
      }
      const condition = await ConditionService.update(req.params.id, {
        nameEN: nameEN ?? existing.nameEN,
        nameFR: nameFR === undefined ? existing.nameFR : nameFR,
      });
      return res.status(200).json(condition);
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "Cette condition existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour de la condition." });
    }
  },
  deleteCondition: async (req, res) => {
    try {
      const existing = await ConditionService.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: "Condition non trouvée." });
      }
      await ConditionService.delete(req.params.id);
      return res.status(200).json({ message: "Condition supprimée." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression de la condition." });
    }
  },
};

export default ConditionController;
