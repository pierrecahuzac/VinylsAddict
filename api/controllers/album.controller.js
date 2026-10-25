import { AlbumService } from "../services/album.service.js";

const AlbumController = {
  getOneAlbum: async (req, res) => {
    try {
      const albumId = req.params.id;
      const album = await AlbumService.getOne(albumId);
      if (!album) {
        return res.status(404).json({ message: "No album find with this id" });
      }
      if (album) {
        delete album.userId;
        delete album.creator;
      }
      return res.status(200).json(album);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des données." });
    }
  },
  getAllAlbums: async (req, res) => {
    try {
      const { artist, title } = req.query;
      const take = Math.min(Math.max(parseInt(req.query.take) || 100, 1), 200);
      const skip = Math.max(parseInt(req.query.skip) || 0, 0);
      const albums = await AlbumService.getAll({ artist, title, take, skip });
      const sanitized = albums.map((a) => {
        const { userId, ...rest } = a;
        return rest;
      });
      return res.status(200).json(sanitized);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des données." });
    }
  },

  create: async (req, res) => {
    try {
      const userId = req.userId;

      const {
        title,
        artist,
        year,
        genreId,
        conditionId,
        variantId,
        coverUrl,
        color,
        price,
        addAlbumToCollection,
        signed,
        diskNumber,
        trackCount,
        formatId,
      } = req.body;

      if (!title || !artist || !formatId) {
        return res.status(400).json({ message: "title, artist et formatId sont requis." });
      }
      const parsedYear = year ? Number(year) : null;
      const parsedDiskNumber = diskNumber ? Number(diskNumber) : null;
      const parsedTrackCount = trackCount ? Number(trackCount) : null;
      if ([parsedYear, parsedDiskNumber, parsedTrackCount].some((v) => v !== null && Number.isNaN(v))) {
        return res.status(400).json({ message: "year, diskNumber et trackCount doivent être numériques." });
      }
      const parsedPrice = price ? Number(price) : null;
      if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
        return res.status(400).json({ message: "price doit être numérique." });
      }

      const result = await AlbumService.create(userId, {
        title,
        artist,
        color,
        coverUrl,
        parsedYear,
        parsedDiskNumber,
        parsedTrackCount,
        parsedPrice,
        genreId,
        variantId,
        formatId,
        conditionId,
        addAlbumToCollection,
        signed,
      });

      return res.status(201).json({
        message: result.userAlbum
          ? "Album créé et ajouté en collection !"
          : "Album créé !",
        album: result.album,
        userAlbum: result.userAlbum,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la création de l'album.",
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, artist, year, color, coverUrl } = req.body;

      const existing = await AlbumService.getById(id);
      if (!existing) return res.status(404).json({ message: "Album introuvable." });

      const requester = await AlbumService.getUser(req.userId);
      if (requester?.role !== "ADMIN" && existing.userId !== req.userId) {
        return res.status(403).json({ message: "Non autorisé." });
      }

      const album = await AlbumService.update(id, {
        title,
        artist,
        releaseDate: year ? parseInt(year) : null,
        color,
        coverUrl,
      });

      return res.status(200).json({ message: "Album mis à jour.", album });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur lors de la mise à jour." });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await AlbumService.getById(id);
      if (!existing) return res.status(404).json({ message: "Album introuvable." });

      const requester = await AlbumService.getUser(req.userId);
      if (requester?.role !== "ADMIN" && existing.userId !== req.userId) {
        return res.status(403).json({ message: "Non autorisé." });
      }

      await AlbumService.delete(id);

      return res.status(200).json({ message: "Album supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur lors de la suppression." });
    }
  },
};

export default AlbumController;
