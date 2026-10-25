import prisma from "../database/prismaClient.js";

export const ConditionService = {
  getAll: async () => prisma.condition.findMany(),
  getById: async (id) => prisma.condition.findUnique({ where: { id } }),
  create: async (nameEN, nameFR) => prisma.condition.create({ data: { nameEN, nameFR } }),
  update: async (id, data) => prisma.condition.update({ where: { id }, data }),
  delete: async (id) => prisma.condition.delete({ where: { id } }),
};
