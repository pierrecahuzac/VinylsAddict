import { get } from "node:http";
import prisma from "../database/prismaClient.js";
import jwt from "jsonwebtoken";
const WishlistController = {
  getUserWishlist: async (req, res) => {
    const userId = req.userId;
    try {
      const userWishlist = await prisma.wishlist.findMany({
        where: { userId },
        include: { album: true },
      });
      
      const flattenedWishlist = userWishlist.map((item) => ({
        ...item.album,
        wishlistId: item.id,
      }));

      return res.status(200).json(flattenedWishlist);
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ error: "Impossible de récupérer la wishlist" });
    }
  },

  addAlbumToUserWishlist: async (req, res) => {
    const userId = req.userId;
    const albumId = req.params.id;

    try {
      const albumIsWishlistedByUser = await prisma.wishlist.findUnique({
        where: { userId_albumId: { userId, albumId } },
      });
      console.log(albumIsWishlistedByUser);

      if (albumIsWishlistedByUser) {
        return res.status(404).json({
          message: "Album déjà dans la wishlist de l'user",
        });
      }
      const wishlistedAlbum = await prisma.wishlist.create({
        data: { userId, albumId },
      });
      return res.status(200).json({
        message: "Album ajouté à votre wishlist !",
        wishlistedAlbum,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Impossible d'ajouter à la wishlist" });
    }
  },
  deleteAlbumFromUserWishlist: async (req, res) => {
    const userId = req.userId;
    const albumId = req.params.id;

    try {
      const deletedWishlistEntry = await prisma.wishlist.delete({
        where: { userId_albumId: { userId, albumId } },
      });

      return res.status(200).json({
        message: "Album retiré de votre wishlist !",
        deletedWishlistEntry,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Impossible de retirer de la wishlist" });
    }
  },

  checkAlbumInWishlist: async (req, res) => {
    const albumId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      const wishlistedAlbum = await prisma.wishlist.findFirst({
        where: {
          albumId: albumId,
          userId: userId,
        },
      });

      if (!wishlistedAlbum) {
        return res
          .status(404)
          .json({ message: `Album non présent dans la wishlist` });
      }
      return res
        .status(200)
        .json({ wishlistedAlbum, message: `Album présent dans la wishlist` });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default WishlistController;
