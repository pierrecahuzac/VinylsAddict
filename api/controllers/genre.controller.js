import prisma from "../database/prismaClient.js";

const GenreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await prisma.genre.findMany();

      return res.status(200).json(genres);
    } catch (error) {
     return   res.status(500).json({ error: error.message });
    }
  },
};

export default GenreController;
