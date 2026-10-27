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

  getImage: async (req, res) => {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ message: "Le paramètre 'url' est requis." });
      }
      const { data, contentType } = await DiscogsService.getImage(url);
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400");
      return res.status(200).send(Buffer.from(data));
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getEditions: async (req, res) => {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res.status(400).json({ message: "Le paramètre 'ids' est requis." });
      }
      const editionIds = String(ids)
        .split(",")
        .map((id) => id.trim())
        .filter((id) => /^\d+$/.test(id));
      if (!editionIds.length) {
        return res.status(400).json({ message: "Aucun identifiant valide fourni." });
      }
      const editions = await DiscogsService.getEditions(editionIds);
      return res.status(200).json({ editions });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
