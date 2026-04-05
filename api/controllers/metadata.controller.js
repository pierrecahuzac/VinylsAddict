import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const MetadataController = {
  getAllMetadatas: async (req, res) => {
    try {
      const [genres, conditions, variants, formats] = await Promise.all([
        prisma.genre.findMany({
          include: { styles: true },
        }),
        prisma.condition.findMany(),
        prisma.vinylVariant.findMany(),
        prisma.format.findMany(),
      ]);

      return res.status(200).json({
        genres,
        conditions,
        variants,
        formats,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors du chargement des métadonnées" });
    }
  },
};

export default MetadataController;
