import { describe, it, expect, vi, beforeEach } from 'vitest';
import MetadataController from '../../controllers/metadata.controller.js';
import prisma from '../../database/prismaClient.js';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    genre: { findMany: vi.fn() },
    condition: { findMany: vi.fn() },
    vinylVariant: { findMany: vi.fn() },
    format: { findMany: vi.fn() },
    style: { findMany: vi.fn() },
  },
}));

describe('MetadataController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  it('getAllMetadatas returns 200 with data', async () => {
    prisma.genre.findMany.mockResolvedValue([{ id: 'g1', name: 'Rock', styles: [] }]);
    prisma.condition.findMany.mockResolvedValue([]);
    prisma.vinylVariant.findMany.mockResolvedValue([]);
    prisma.format.findMany.mockResolvedValue([]);
    prisma.style.findMany.mockResolvedValue([]);
    await MetadataController.getAllMetadatas(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ genres: expect.any(Array) }));
  });
});
