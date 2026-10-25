import { WishlistService } from "../services/wishlist.service.js";

const WishlistController = {
  getUserWishlist: async (req, res) => {
    const userId = req.userId;
    try {
      const userWishlist = await WishlistService.getAllByUser(userId);

      const flattenedWishlist = userWishlist.map((item) => ({
        ...item.album,
        wishlistId: item.id,
      }));

      return res.status(200).json(flattenedWishlist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Impossible de récupérer la wishlist" });
    }
  },

  addAlbumToUserWishlist: async (req, res) => {
    const userId = req.userId;
    const albumId = req.params.id;

    try {
      const existing = await WishlistService.findEntry(userId, albumId);
      if (existing) {
        return res.status(404).json({
          message: "Album déjà dans la wishlist de l'user",
        });
      }
      const wishlistedAlbum = await WishlistService.create(userId, albumId);
      return res.status(200).json({
        message: "Album ajouté à votre wishlist !",
        wishlistedAlbum,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Impossible d'ajouter à la wishlist" });
    }
  },
  deleteAlbumFromUserWishlist: async (req, res) => {
    const userId = req.userId;
    const albumId = req.params.id;

    try {
      const deletedWishlistEntry = await WishlistService.delete(userId, albumId);
      return res.status(200).json({
        message: "Album retiré de votre wishlist !",
        deletedWishlistEntry,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Impossible de retirer de la wishlist" });
    }
  },

  checkAlbumInWishlist: async (req, res) => {
    const albumId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const wishlistedAlbum = await WishlistService.check(userId, albumId);
      if (!wishlistedAlbum) {
        return res.status(404).json({ message: "Album non présent dans la wishlist" });
      }
      return res.status(200).json({ wishlistedAlbum, message: "Album présent dans la wishlist" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur lors de la vérification de la wishlist." });
    }
  },
};

export default WishlistController;
