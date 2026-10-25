import { CollectionService } from "../services/collection.service.js";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const CollectionController = {
  addAlbumToCollection: async (req, res) => {
    const userId = req.userId;

    try {
      const { albumId } = req.params;
      const { price, conditionId, signed } = req.body;

      if (!albumId) {
        return res.status(400).json({ message: "albumId requis." });
      }
      const parsedPrice = price ? Number(price) : null;
      if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
        return res.status(400).json({ message: "price doit être numérique." });
      }

      let userAlbum;
      try {
        userAlbum = await CollectionService.create(
          userId,
          albumId,
          parsedPrice,
          conditionId ? conditionId : null,
          signed === true || signed === "true" || signed === 1 || signed === "1"
        );
      } catch (error) {
        if (error?.code === 'P2002') {
          return res.status(409).json({ message: "Cet album est déjà dans votre collection." });
        }
        throw error;
      }

      return res
        .status(201)
        .json({ message: "Album ajouté à la collection !", userAlbum });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Impossible d'ajouter l'album à la collection." });
    }
  },
  updateAlbumInCollection: async (req, res) => {
    try {
      const { userAlbumId } = req.params;
      const userId = req.userId;
      const { price, conditionId, signed } = req.body;

      const existing = await CollectionService.getById(userAlbumId);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      const parsedPrice = price === undefined ? existing.price : (price ? Number(price) : null);
      if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
        return res.status(400).json({ message: "price doit être numérique." });
      }

      const updated = await CollectionService.update(userAlbumId, {
        price: parsedPrice,
        conditionId: conditionId === undefined ? existing.conditionId : (conditionId ? conditionId : null),
        signed: signed === undefined ? existing.signed : (signed === true || signed === "true" || signed === 1 || signed === "1"),
      });

      return res.status(200).json({ message: "Album mis à jour.", userAlbum: updated });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la mise à jour." });
    }
  },

  deleteAlbumFromCollection: async (req, res) => {
    try {
      const { userAlbumId } = req.params;
      const userId = req.userId;

      const userAlbum = await CollectionService.getById(userAlbumId);

      if (!userAlbum || userAlbum.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      for (const img of userAlbum.images) {
        try {
          const filePath = path.join(process.cwd(), img.url.replace(/^\//, ''));
          await fs.unlink(filePath);
        } catch (e) {
          console.warn(`Fichier non supprimé: ${img.url}`, e.message);
        }
      }

      await CollectionService.delete(userAlbumId);

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

      const ua = await CollectionService.getById(userAlbumId);
      if (!ua || ua.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      const imageCount = await CollectionService.countImages(userAlbumId);
      if (imageCount >= 5) {
        return res.status(400).json({ message: "Limite de 5 photos atteinte pour cet album." });
      }

      const filename = `${randomUUID()}.webp`;
      const outputPath = path.join('uploads', filename);

      await fs.mkdir('uploads', { recursive: true });

      await sharp(file.buffer)
        .rotate()
        .webp({ quality: 85 })
        .toFile(outputPath);

      const imageUrl = `/uploads/${filename}`;

      const image = await CollectionService.createImage(userAlbumId, imageUrl);

      return res.status(201).json({ message: "Image ajoutée !", image });
    } catch (error) {
      console.error(error);
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

      const userAlbum = await CollectionService.getById(userAlbumId);
      if (!userAlbum || userAlbum.userId !== userId) {
        return res.status(404).json({ message: "Album non trouvé dans votre collection." });
      }

      const image = await CollectionService.findImage(imageId);
      if (!image || image.userCollectionId !== userAlbumId) {
        return res.status(404).json({ message: "Image non trouvée pour cet album." });
      }

      try {
        const filePath = path.join(process.cwd(), image.url.replace(/^\//, ''));
        await fs.unlink(filePath);
      } catch (e) {
        console.warn(`Fichier non supprimé: ${image.url}`, e.message);
      }

      await CollectionService.deleteImage(imageId);

      return res.status(200).json({ message: "Image supprimée !" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression de l'image." });
    }
  },
};


export default CollectionController;
