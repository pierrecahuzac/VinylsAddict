import prisma from "../database/prismaClient.js";

export const AlbumService = {
  getById: async (id) => prisma.album.findUnique({ where: { id } }),
  getUser: async (id) => prisma.user.findUnique({ where: { id } }),
  getAll: async ({ artist, title, take, skip }) => {
    const where = {};
    if (artist) where.artist = { equals: String(artist), mode: "insensitive" };
    if (title) where.title = { equals: String(title), mode: "insensitive" };
    return prisma.album.findMany({
      where,
      include: { format: true, genres: true, vinylVariant: true },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },
  getOne: async (id) =>
    prisma.album.findUnique({
      where: { id },
      include: { format: true, genres: true, styles: true, vinylVariant: true },
    }),
  create: async (userId, data) => {
    return prisma.$transaction(async (tx) => {
      const album = await tx.album.create({
        data: {
          title: data.title,
          color: data.color,
          artist: data.artist,
          releaseDate: data.parsedYear,
          coverUrl: data.coverUrl,
          creator: { connect: { id: userId } },
          diskNumber: data.parsedDiskNumber,
          trackCount: data.parsedTrackCount,
          vinylVariant: data.variantId ? { connect: { id: data.variantId } } : undefined,
          genres: data.genreId ? { connect: { id: data.genreId } } : undefined,
          format: data.formatId ? { connect: { id: data.formatId } } : undefined,
        },
        include: { genres: true },
      });

      let userAlbum = null;
      if (data.addAlbumToCollection) {
        userAlbum = await tx.userAlbum.create({
          data: {
            userId,
            albumId: album.id,
            price: data.parsedPrice,
            signed: data.signed === true || data.signed === "true" || data.signed === 1 || data.signed === "1",
            conditionId: data.conditionId ? data.conditionId : null,
          },
        });
      }
      return { album, userAlbum };
    });
  },
  update: async (id, data) => prisma.album.update({ where: { id }, data }),
  delete: async (id) => prisma.album.delete({ where: { id } }),
};
