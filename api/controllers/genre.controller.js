import prisma from "../database/prismaClient.js";

const GenreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await prisma.genre.findMany();

      return res.status(200).json(genres);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des genres." });
    }
  },
};

export default GenreController;
