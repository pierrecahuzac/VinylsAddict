
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
          .json({ message: `Détaisl de l'album introuvables` });
      }
      return res
        .status(201)
        .json({ userAlbum, message: `Détails de l'album trouvés` });
    } catch (error) {
      console.log(error);
    }
  },
  getAllAlbums: async (req, res) => {
    try {
      const albums = await prisma.album.findMany();
      console.log(albums);
      return res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const token = req.cookies.va_token;
      console.log(token);

      if (!token) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = tokenDecoded.userId;

      // On récupère les IDs envoyés par le front-end
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
      } = req.body;
      console.log(price);
      const newAlbum = await prisma.album.create({
        data: {
          title,
          color,
          artist,
          releaseDate: year ? parseInt(year) : null,
          coverUrl,

          user: {
            connect: { id: userId },
          },
          vinylVariant: variantId
            ? {
                connect: { id: variantId },
              }
            : undefined,
          genres: genreId
            ? {
                connect: { id: genreId },
              }
            : undefined,
        },

        include: {
          genres: true,
          // variants: true,
        },
      });
      console.log(newAlbum);

      const newUserAlbum = await prisma.userAlbum.create({
        data: {
          userId: userId,
          albumId: newAlbum.id,
          price: price ? parseFloat(price) : null,
          conditionId: conditionId ? conditionId : null,
        },
      });
      return res.status(201).json({
        message: "Album créé !",
        album: newAlbum,
        useralbum: newUserAlbum,
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
