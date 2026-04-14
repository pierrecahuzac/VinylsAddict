import prisma from "../database/prismaClient.js";
import jwt from "jsonwebtoken";
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

      if (!album) {
        return res.status(404).json({ message: "No album find with this id" });
      }
      return res.status(200).json(album);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getAllAlbums: async (req, res) => {
    try {
      const albums = await prisma.album.findMany({
        include: {
          format: true,
          genres: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log(albums);
      return res.status(200).json(albums);
    } catch (error) {
     return res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const token = req.cookies.va_token;
      if (!token) return res.status(401).json({ message: "Non authentifié" });

      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = tokenDecoded.userId;

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
        diskNumber,
        trackCount,
        formatId,
      } = req.body;
      console.log(req.body);

      // Utilisation d'une transaction pour garantir l'intégrité des données
      const result = await prisma.$transaction(async (tx) => {
        // 1. Création de l'album
        const album = await tx.album.create({
          data: {
            title,
            color,
            artist,
            releaseDate: year ? parseInt(year) : null,
            coverUrl,
            creator: { connect: { id: userId } },
            diskNumber: diskNumber ? parseInt(diskNumber) : null,
            trackCount: trackCount ? parseInt(trackCount) : null,
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
              price: price ? parseFloat(price) : null,
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
     
      return res.status(500).json({
        message: "Erreur lors de la création",
        error: error.message,
      });
    }
  },
};

export default AlbumController;
