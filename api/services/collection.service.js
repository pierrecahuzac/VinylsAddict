import prisma from "../database/prismaClient.js";

export const CollectionService = {
  getById: async (id) => prisma.userAlbum.findUnique({ where: { id }, include: { images: true } }),
  create: async (userId, albumId, price, conditionId, signed) =>
    prisma.userAlbum.create({
      data: {
        user: { connect: { id: userId } },
        album: { connect: { id: albumId } },
        price,
        signed,
        condition: conditionId ? { connect: { id: conditionId } } : undefined,
      },
    }),
  update: async (id, data) => prisma.userAlbum.update({ where: { id }, data }),
  delete: async (id) => prisma.userAlbum.delete({ where: { id } }),
  countImages: async (userAlbumId) => prisma.collectionImage.count({ where: { userCollectionId: userAlbumId } }),
  createImage: async (userAlbumId, url) =>
    prisma.collectionImage.create({ data: { url, userCollection: { connect: { id: userAlbumId } } } }),
  findImage: async (imageId) => prisma.collectionImage.findUnique({ where: { id: imageId } }),
  deleteImage: async (imageId) => prisma.collectionImage.delete({ where: { id: imageId } }),
};
