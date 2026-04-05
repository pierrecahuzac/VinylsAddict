import { log } from "node:console";
import prisma from "../database/prismaClient.js";
import jwt from "jsonwebtoken";
const AlbumController = {
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
      price 
    } = req.body;
    console.log(price);
    
    const newAlbum = await prisma.album.create({
      data: {
        title,
        artist,
        releaseDate: year ? parseInt(year) : null,
        coverUrl,
        color,
        price: price ? parseFloat(price) : null,
        // Relation 1-n : Un album appartient à un utilisateur
        user: {
          connect: { id: userId }
        },
        // Relation 1-n : Lier à une condition existante
        condition: conditionId ? {
          connect: { id: conditionId }
        } : undefined,
        // Relation n-n : Lier à un genre
        genres: genreId ? {
          connect: { id: genreId }
        } : undefined,
        // Relation n-n : Lier à une variante (couleur)
        variants: variantId ? {
          connect: { id: variantId }
        } : undefined
      },
      // Optionnel : On inclut les relations dans la réponse pour le front
      include: {
        genres: true,
        condition: true,
        variants: true
      }
    });

    return res.status(201).json({ 
      message: "Album créé !", 
      album: newAlbum 
    });

  } catch (error) {
    console.error("Erreur Prisma Create:", error);
    return res.status(500).json({ 
      message: "Erreur lors de la création", 
      error: error.message 
    });
  }
}
};

export default AlbumController;
