import prisma from "../database/prismaClient.js";

const AlbumServices = {
  getOneAlbum: async (albumId) => {
    const result = await prisma.album.findUnique({
      where: {
        id: albumId,
      },
      include: {
        format: true,
        genres: true,
        styles: true,
        vinylVariant: true,
      },
    });
    if (result) {
      delete result.userId;
      delete result.creator;
    }
    return result;
  },
  getAllAlbums: async (artist, title) => {
    const where = {};
    if (artist) where.artist = { equals: String(artist), mode: "insensitive" };
    if (title) where.title = { equals: String(title), mode: "insensitive" };
    const result = await prisma.album.findMany({
      where,
      include: {
        format: true,
        genres: true,
        styles: true,
        vinylVariant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result.map((a) => {
      const { userId, creator, ...rest } = a;
      return rest;
    });
  },
  create: async (albumData, userId) => {
    // Utilisation d'une transaction pour garantir l'intégrité des données

    const result = await prisma.$transaction(async (tx) => {
      const album = await tx.album.create({
        data: {
          title: albumData.title,
          color: albumData.color,
          artist: albumData.artist,
          releaseDate: albumData.year ? parseInt(albumData.year) : null,
          coverUrl: albumData.coverUrl,
          creator: { connect: { id: userId } },
          diskNumber: albumData.diskCount
            ? parseInt(albumData.diskCount)
            : null,
          trackCount: albumData.trackCount
            ? parseInt(albumData.trackCount)
            : null,
          vinylVariant: albumData.variantId
            ? { connect: { id: albumData.variantId } }
            : undefined,
          genres: albumData.genreId
            ? { connect: { id: albumData.genreId } }
            : undefined,
          format: albumData.formatId
            ? { connect: { id: albumData.formatId } }
            : undefined,
        },
        include: { genres: true },
      });

      let userAlbum = null;

      if (albumData.addAlbumToCollection) {
        userAlbum = await tx.userAlbum.create({
          data: {
            userId: userId,
            albumId: album.id,
            price: albumData.price ? parseFloat(albumData.price) : null,
            conditionId: albumData.conditionId ? albumData.conditionId : null,
          },
        });
      }
      return { album, userAlbum };
    });

    return result;
  },
};

export default AlbumServices;
