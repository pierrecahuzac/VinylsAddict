import prisma from "../database/prismaClient.js";
import jwt from "jsonwebtoken";
const WishlistController = {
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
        where: { userId_albumId: { userId, albumId } },
      });
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
};

export default WishlistController;
