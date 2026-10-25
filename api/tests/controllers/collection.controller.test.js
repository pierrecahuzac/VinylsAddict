import { describe, it, expect, vi, beforeEach } from 'vitest';
import CollectionController from '../../controllers/collection.controller.js';
import prisma from '../../database/prismaClient.js';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    userAlbum: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    collectionImage: { count: vi.fn(), create: vi.fn(), delete: vi.fn(), findUnique: vi.fn() },
  },
}));

describe('CollectionController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { albumId: 'a1' }, body: {}, userId: 'u1' };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  it('addAlbumToCollection validates price', async () => {
    req.body = { price: 'abc' };
    await CollectionController.addAlbumToCollection(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('addAlbumToCollection allows the same album twice', async () => {
    req.body = { price: '10' };
    prisma.userAlbum.create
      .mockResolvedValueOnce({ id: 'ua1' })
      .mockResolvedValueOnce({ id: 'ua2' });

    await CollectionController.addAlbumToCollection(req, res);
    await CollectionController.addAlbumToCollection(req, res);

    expect(prisma.userAlbum.create).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('addAlbumToCollection creates successfully', async () => {
    req.body = { price: '10', conditionId: 'c1' };
    prisma.userAlbum.create.mockResolvedValue({ id: 'ua1' });
    await CollectionController.addAlbumToCollection(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
