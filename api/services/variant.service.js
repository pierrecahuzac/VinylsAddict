import prisma from "../database/prismaClient.js";

export const VariantService = {
  getAll: async () => prisma.vinylVariant.findMany(),
  getById: async (id) => prisma.vinylVariant.findUnique({ where: { id } }),
  create: async (nameEN, nameFR) => prisma.vinylVariant.create({ data: { nameEN, nameFR } }),
  update: async (id, data) => prisma.vinylVariant.update({ where: { id }, data }),
  delete: async (id) => prisma.vinylVariant.delete({ where: { id } }),
};
