import prisma from "../database/prismaClient.js";

export const StyleService = {
  getAll: async () => prisma.style.findMany({ include: { genre: true } }),
  getById: async (id) => prisma.style.findUnique({ where: { id }, include: { genre: true } }),
  create: async (name, genreId) => prisma.style.create({ data: { name, genre: { connect: { id: genreId } } } }),
  update: async (id, data) => prisma.style.update({ where: { id }, data }),
  delete: async (id) => prisma.style.delete({ where: { id } }),
};
