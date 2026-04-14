import { describe, it, expect, vi, beforeEach } from 'vitest';
import Usercontroller from './user.controller.js';
import prisma from '../database/prismaClient.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

vi.mock('../database/prismaClient.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');

describe('Usercontroller.login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: 'test@example.com', password: 'password123' },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('devrait retourner 200 et un token si les identifiants sont corrects', async () => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcryptjs.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-jwt-token');

    await Usercontroller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith('va_token', 'fake-jwt-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      isLogged: true,
      message: 'Login successful'
    }));
  });

  it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await Usercontroller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Combinaison email / password not work" });
  });

  it('devrait retourner 400 si le mot de passe est incorrect', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed' });
    bcryptjs.compare.mockResolvedValue(false);

    await Usercontroller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid password" });
  });
});