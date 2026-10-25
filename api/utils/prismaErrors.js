export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: "P2002",
  FOREIGN_KEY_CONSTRAINT: "P2003",
  RECORD_NOT_FOUND: "P2025",
};

export const isPrismaError = (error, code) => error?.code === code;
