import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlbumController from '../../controllers/album.controller.js';
import prisma from '../../database/prismaClient.js';
import jwt from 'jsonwebtoken';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    album: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));
vi.mock('jsonwebtoken');

describe('AlbumController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, cookies: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  it('getAllAlbums returns 200 with albums', async () => {
    prisma.album.findMany.mockResolvedValue([{ id: '1', title: 'T', artist: 'A' }]);
    await AlbumController.getAllAlbums(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'T' })]));
  });

  it('create returns 400 if title/artist/formatId missing', async () => {
    req.cookies.va_token = 'tok';
    jwt.verify.mockReturnValue({ userId: 'u1' });
    req.userId = 'u1';
    req.body = { artist: 'A', formatId: 'f1' };
    await AlbumController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('create returns 400 if year is not numeric', async () => {
    req.cookies.va_token = 'tok';
    jwt.verify.mockReturnValue({ userId: 'u1' });
    req.userId = 'u1';
    req.body = { title: 'T', artist: 'A', formatId: 'f1', year: 'abc' };
    await AlbumController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
