import prisma from "../database/prismaClient.js";

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
};

export default AlbumController;
