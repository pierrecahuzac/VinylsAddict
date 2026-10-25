import prisma from "../database/prismaClient.js";

export const FormatService = {
  getAll: async () => prisma.format.findMany(),
  getById: async (id) => prisma.format.findUnique({ where: { id } }),
  create: async (name, speed, description) => prisma.format.create({ data: { name, speed, description } }),
  update: async (id, data) => prisma.format.update({ where: { id }, data }),
  delete: async (id) => prisma.format.delete({ where: { id } }),
};
