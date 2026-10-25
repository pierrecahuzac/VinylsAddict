import prisma from "../database/prismaClient.js";

export const AdminMiddleWare = {
  requireAdmin: async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json("Utilisateur non autorisé");
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
  },
};
