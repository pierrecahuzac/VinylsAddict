import prisma from "../database/prismaClient.js";

export const GenreService = {
  getAll: async () => prisma.genre.findMany({ include: { styles: true } }),
  getById: async (id) => prisma.genre.findUnique({ where: { id }, include: { styles: true } }),
  create: async (name) => prisma.genre.create({ data: { name } }),
  update: async (id, name) => prisma.genre.update({ where: { id }, data: { name } }),
  delete: async (id) => prisma.genre.delete({ where: { id } }),
};
