import { describe, it, expect, vi, beforeEach } from 'vitest';
import PasswordResetController from '../../controllers/passwordReset.controller.js';
import prisma from '../../database/prismaClient.js';
import bcryptjs from 'bcryptjs';
import { sendPasswordResetEmail } from '../../services/mailer.service.js';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));
vi.mock('bcryptjs');
vi.mock('../../services/mailer.service.js', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

describe('PasswordResetController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('refuse un email invalide', async () => {
    req.body = { email: 'pas-un-email' };
    await PasswordResetController.forgotPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('répond de manière générique quand le compte n’existe pas', async () => {
    req.body = { email: 'inconnu@example.com' };
    prisma.user.findUnique.mockResolvedValue(null);

    await PasswordResetController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('crée un token et envoie le lien quand le compte existe', async () => {
    req.body = { email: 'user@example.com' };
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@example.com' });
    prisma.passwordResetToken.create.mockResolvedValue({});
    sendPasswordResetEmail.mockResolvedValue(true);

    await PasswordResetController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(prisma.passwordResetToken.create).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith('user@example.com', expect.any(String));
  });

  it('refuse un token manquant', async () => {
    req.body = { password: 'password123', passwordConfirmation: 'password123' };
    await PasswordResetController.resetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('refuse un mot de passe trop court', async () => {
    req.body = { token: 'tok', password: 'short', passwordConfirmation: 'short' };
    await PasswordResetController.resetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('refuse un token expiré ou utilisé', async () => {
    req.body = { token: 'tok', password: 'password123', passwordConfirmation: 'password123' };
    prisma.passwordResetToken.findUnique.mockResolvedValue({
      id: 'r1', userId: 'u1', usedAt: null, expiresAt: new Date(Date.now() - 1000),
    });
    await PasswordResetController.resetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('réinitialise le mot de passe avec un token valide', async () => {
    req.body = { token: 'tok', password: 'password123', passwordConfirmation: 'password123' };
    prisma.passwordResetToken.findUnique.mockResolvedValue({
      id: 'r1', userId: 'u1', usedAt: null, expiresAt: new Date(Date.now() + 60000),
    });
    bcryptjs.hash.mockResolvedValue('hashed');
    prisma.$transaction.mockResolvedValue([]);

    await PasswordResetController.resetPassword(req, res);

    expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 10);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
