import prisma from "../database/prismaClient.js";
const AlbumController = {
  getOneAlbum: async (req, res) => {
    try {
      const albumId = req.params.id;

      const album = await prisma.album.findUnique({
        where: {
          id: albumId,
        },
        include: {
          format: true,
          genres: true,
          styles: true,
          vinylVariant: true,
        },
      });
      if (album) {
        delete album.userId;
        delete album.creator;
      }


      if (!album) {
        return res.status(404).json({ message: "No album find with this id" });
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
      const where = {};
      if (artist) where.artist = { equals: String(artist), mode: "insensitive" };
      if (title) where.title = { equals: String(title), mode: "insensitive" };
      const albums = await prisma.album.findMany({
        where,
        include: {
          format: true,
          genres: true,
          vinylVariant: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        skip,
      });
      // Masquer le créateur : on garde title/artist mais on n'expose jamais userId/creator
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

      // Utilisation d'une transaction pour garantir l'intégrité des données
      const result = await prisma.$transaction(async (tx) => {
        // 1. Création de l'album
        const album = await tx.album.create({
          data: {
            title,
            color,
            artist,
            releaseDate: parsedYear,
            coverUrl,
            creator: { connect: { id: userId } },
            diskNumber: parsedDiskNumber,
            trackCount: parsedTrackCount,
            vinylVariant: variantId
              ? { connect: { id: variantId } }
              : undefined,
            genres: genreId ? { connect: { id: genreId } } : undefined,
            format: formatId ? { connect: { id: formatId } } : undefined,
          },
          include: { genres: true },
        });

        let userAlbum = null;

        // 2. Création de l'entrée collection si demandé
        if (addAlbumToCollection) {
          userAlbum = await tx.userAlbum.create({
            data: {
              userId: userId,
              albumId: album.id,
              price: parsedPrice,
              signed: signed === true || signed === "true" || signed === 1 || signed === "1",
              // Si conditionId est vide, on ne connecte rien
              conditionId: conditionId ? conditionId : null,
            },
          });
        }

        return { album, userAlbum };
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

      const existing = await prisma.album.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: "Album introuvable." });

      const requester = await prisma.user.findUnique({ where: { id: req.userId } });
      if (requester?.role !== "ADMIN" && existing.userId !== req.userId) {
        return res.status(403).json({ message: "Non autorisé." });
      }

      const album = await prisma.album.update({
        where: { id },
        data: {
          title,
          artist,
          releaseDate: year ? parseInt(year) : null,
          color,
          coverUrl,
        },
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

      const existing = await prisma.album.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: "Album introuvable." });

      const requester = await prisma.user.findUnique({ where: { id: req.userId } });
      if (requester?.role !== "ADMIN" && existing.userId !== req.userId) {
        return res.status(403).json({ message: "Non autorisé." });
      }

      await prisma.album.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Album supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur lors de la suppression." });
    }
  },
};

export default AlbumController;
