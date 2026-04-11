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
        return res.status(200).json({ message: "No album find with this id" });
      }
      return res.status(200).json(album);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUserAlbum: async (req, res) => {
    const albumId = req.params.id;
    const token = req.cookies.va_token;
    if (!token) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = tokenDecoded.userId;
    try {
      const userAlbum = await prisma.userAlbum.findUnique({
        where: {
          userId_albumId: {
            userId: userId,
            albumId: albumId,
          },
        },
        include: {
          condition: true,
        },
      });

      if (!userAlbum) {
        return res
          .status(404)
          .json({ message: `Détails de l'album introuvables` });
      }
      return res
        .status(201)
        .json({ userAlbum, message: `Détails de l'album trouvés` });
    } catch (error) {
      console.log(error);
    }
  },
  getAllUserAlbums: async (req, res) => {
    const token = req.cookies.va_token;

    if (!token) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = tokenDecoded.userId;
    try {
      const allUserAlbums = await prisma.album.findMany({
        where: {
          userId,
        },
      });
      console.log(allUserAlbums);

      if (allUserAlbums.length < 1) {
        return res.status(404).json({ message: `Collection vide` });
      }
      return res.status(201).json({
        allUserAlbums,
        message: `Liste des albums dans la collection`,
      });
    } catch (error) {
      console.log(error);
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
      res.status(500).json({ error: error.message });
    }
  },
  addAlbumToUserWishlist: async (req, res) => {
    const token = req.cookies.va_token;
    if (!token) {
      return res.status(401).json({
        message: "Vous devez être conencté pour acceder à cette fonctionnalité",
      });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = tokenDecoded.userId;
    const albumId = req.params.id;

    try {
      const albumIsWishlistedByUser = await prisma.wishlist.findUnique({
        where: {
          userId,
          albumId,
        },
      });
      if (albumIsWishlistedByUser) {
        return res.status(404).json({
          message: "Album déjà dans la wishlist de l'user",
        });
      }
      const wishlistedAlbum = await prisma.user.update({
        where: { id: userId },
        data: {
          wishlist: {
            connect: { id: albumId }, // C'est ici que la magie opère
          },
        },
        include: {
          wishlist: true, // Optionnel : pour renvoyer la liste à jour
        },
      });
      return res.status(200).json({
        message: "Album ajouté à votre wishlist !",
        wishlistedAlbum,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Impossible d'ajouter à la wishlist" });
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
      } = req.body;

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
            vinylVariant: variantId
              ? { connect: { id: variantId } }
              : undefined,
            genres: genreId ? { connect: { id: genreId } } : undefined,
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
              condition: conditionId
                ? { connect: { id: conditionId } }
                : undefined,
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
      console.error("Erreur Prisma Create:", error);
      return res.status(500).json({
        message: "Erreur lors de la création",
        error: error.message,
      });
    }
  },
};

export default AlbumController;
