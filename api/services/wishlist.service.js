import prisma from "../database/prismaClient.js";

export const WishlistService = {
  getAllByUser: async (userId) =>
    prisma.wishlist.findMany({ where: { userId }, include: { album: true } }),
  findEntry: async (userId, albumId) =>
    prisma.wishlist.findUnique({ where: { userId_albumId: { userId, albumId } } }),
  create: async (userId, albumId) => prisma.wishlist.create({ data: { userId, albumId } }),
  delete: async (userId, albumId) => prisma.wishlist.delete({ where: { userId_albumId: { userId, albumId } } }),
  check: async (userId, albumId) => prisma.wishlist.findFirst({ where: { userId, albumId } }),
};
