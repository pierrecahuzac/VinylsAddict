import prisma from "../database/prismaClient.js";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const CollectionController = {
  addAlbumToCollection: async (req, res) => {
    const userId = req.userId;
    
    


    try {
      const { albumId } = req.params;
      const { price, conditionId } = req.body;

      const userAlbum = await prisma.userAlbum.create({
        data: {
          user: { connect: { id: userId } },
          album: { connect: { id: albumId } },
          price: price ? parseFloat(price) : null,
          condition: { connect: { id: conditionId } },
        },
      });
  

      return res
        .status(201)
        .json({ message: "Album ajouté à la collection !", userAlbum });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Impossible d'ajouter l'album à la collection." });
    }
  },
  deleteAlbumFromCollection: async (req, res) => {
    try {
      const { userAlbumId } = req.params;
      const userId = req.userId;

      // Vérifier si l'album appartient bien à l'utilisateur
      const userAlbum = await prisma.userAlbum.findUnique({
        where: { id: userAlbumId },
        include: { images: true },
      });

      if (!userAlbum || userAlbum.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      // Suppression fichiers associés (best effort)
      for (const img of userAlbum.images) {
        try {
          const filePath = path.join(process.cwd(), img.url.replace(/^\//, ''));
          await fs.unlink(filePath);
        } catch (e) {
          console.warn(`Fichier non supprimé: ${img.url}`, e.message);
        }
      }

      await prisma.userAlbum.delete({
        where: { id: userAlbumId },
      });

      return res.status(200).json({ message: "Album supprimé de la collection." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression." });
    }
  },
  addImageToUserAlbum: async (req, res) => {
    try {
      const { userAlbumId } = req.params;
      const userId = req.userId;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Aucune image fournie." });
      }

      // Vérifier si l'album appartient bien à l'utilisateur
      const userAlbum = await prisma.userAlbum.findUnique({
        where: { id: userAlbumId },
      });

      if (!userAlbum || userAlbum.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      // Limite : 10 images max par UserAlbum
      const imageCount = await prisma.collectionImage.count({
        where: { userCollectionId: userAlbumId },
      });
      if (imageCount >= 10) {
        return res.status(400).json({ message: "Limite de 10 photos atteinte pour cet album." });
      }

      // Nettoyage EXIF/GPS + conversion universelle WebP : sharp supprime toutes les métadonnées par défaut
      // On ré-encode tout en WebP sans withMetadata() -> image anonymisée + léger
      const filename = `${randomUUID()}.webp`;
      const outputPath = path.join('uploads', filename);

      await fs.mkdir('uploads', { recursive: true });

      await sharp(file.buffer)
        .rotate() // applique l'orientation EXIF puis la supprime
        .webp({ quality: 85 })
        .toFile(outputPath);

      const imageUrl = `/uploads/${filename}`;

      const image = await prisma.collectionImage.create({
        data: {
          url: imageUrl,
          userCollection: { connect: { id: userAlbumId } },
        },
      });

      return res.status(201).json({ message: "Image ajoutée !", image });
    } catch (error) {
      console.error(error);
      // Multer fileFilter ou sharp
      if (error.message?.includes('Type de fichier non autorisé')) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ error: "Erreur serveur lors de l'ajout de l'image." });
    }
  },
  deleteImageFromUserAlbum: async (req, res) => {
    try {
      const { userAlbumId, imageId } = req.params;
      const userId = req.userId;

      // Vérifier ownership du UserAlbum
      const userAlbum = await prisma.userAlbum.findUnique({
        where: { id: userAlbumId },
      });

      if (!userAlbum || userAlbum.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      // Vérifier que l'image appartient bien à ce UserAlbum
      const image = await prisma.collectionImage.findUnique({
        where: { id: imageId },
      });

      if (!image || image.userCollectionId !== userAlbumId) {
        return res.status(404).json({ message: "Image non trouvée pour cet album." });
      }

      // Supprimer fichier disque (best effort)
      try {
        const filePath = path.join(process.cwd(), image.url.replace(/^\//, ''));
        await fs.unlink(filePath);
      } catch (e) {
        // fichier déjà absent ou erreur FS : on log mais on continue la suppression DB
        console.warn(`Fichier non supprimé: ${image.url}`, e.message);
      }

      await prisma.collectionImage.delete({
        where: { id: imageId },
      });

      return res.status(200).json({ message: "Image supprimée !" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression de l'image." });
    }
  },
};

export default CollectionController;
