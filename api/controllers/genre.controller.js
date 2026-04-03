const GenreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await prisma.genre.findMany();
      console.log(genres);

      return res.status(200).json(genres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default GenreController;
