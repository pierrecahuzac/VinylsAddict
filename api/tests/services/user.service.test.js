import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteUserAndAnonymize, SYSTEM_USER_EMAIL } from '../../services/user.service.js';
import prisma from '../../database/prismaClient.js';
import bcryptjs from 'bcryptjs';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    userAlbum: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}));

describe('deleteUserAndAnonymize', () => {
  let tx;

  beforeEach(() => {
    tx = {
      album: { updateMany: vi.fn().mockResolvedValue({ count: 2 }) },
      user: { delete: vi.fn().mockResolvedValue({}) },
    };
    bcryptjs.hash.mockResolvedValue('hashed');
    prisma.$transaction.mockImplementation(async (callback) => callback(tx));
    vi.clearAllMocks();
  });

  it('retourne 404 si l’utilisateur n’existe pas', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const result = await deleteUserAndAnonymize('missing');

    expect(result).toEqual({ ok: false, status: 404, message: 'Utilisateur introuvable' });
    expect(prisma.user.upsert).not.toHaveBeenCalled();
  });

  it('refuse de supprimer le compte système', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'sys', email: SYSTEM_USER_EMAIL });

    const result = await deleteUserAndAnonymize('sys');

    expect(result.status).toBe(403);
    expect(prisma.user.upsert).not.toHaveBeenCalled();
  });

  it('réassigne les albums au compte système puis supprime l’utilisateur', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@test.com' });
    prisma.user.upsert.mockResolvedValue({ id: 'sys' });
    prisma.userAlbum.findMany.mockResolvedValue([]);

    const result = await deleteUserAndAnonymize('u1');

    expect(result).toMatchObject({ ok: true, albumsAnonymized: 2, systemUserId: 'sys' });
    expect(tx.album.updateMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      data: { userId: 'sys' },
    });
    expect(tx.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
  });
});
