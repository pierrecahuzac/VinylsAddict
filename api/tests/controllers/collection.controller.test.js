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

  it('deleteAlbumFromCollection returns 404 when album not found', async () => {
    prisma.userAlbum.findUnique.mockResolvedValue(null);
    req = { params: { userAlbumId: 'ua1' }, body: {}, userId: 'u1' };

    await CollectionController.deleteAlbumFromCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(prisma.userAlbum.delete).not.toHaveBeenCalled();
  });

  it('deleteAlbumFromCollection deletes when owned', async () => {
    prisma.userAlbum.findUnique.mockResolvedValue({ id: 'ua1', userId: 'u1', images: [] });
    req = { params: { userAlbumId: 'ua1' }, body: {}, userId: 'u1' };

    await CollectionController.deleteAlbumFromCollection(req, res);

    expect(prisma.userAlbum.delete).toHaveBeenCalledWith({ where: { id: 'ua1' } });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteAlbumFromCollection handles P2025 as not found', async () => {
    const err = new Error('Record not found');
    err.code = 'P2025';
    prisma.userAlbum.findUnique.mockResolvedValue({ id: 'ua1', userId: 'u1', images: [] });
    prisma.userAlbum.delete.mockImplementation(() => Promise.reject(err));
    req = { params: { userAlbumId: 'ua1' }, body: {}, userId: 'u1' };

    await CollectionController.deleteAlbumFromCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
