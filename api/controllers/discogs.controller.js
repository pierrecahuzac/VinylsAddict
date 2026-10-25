import { DiscogsService } from "../services/discogs.service.js";

export const DiscogsController = {
  search: async (req, res) => {
    try {
      const { q, type, page, per_page } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Le paramètre de recherche 'q' est requis." });
      }
      const data = await DiscogsService.search({ query: q, type, page, per_page });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getRelease: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "L'identifiant de la release est requis." });
      }
      const data = await DiscogsService.getRelease(id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
