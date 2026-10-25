import { describe, it, expect, vi, beforeEach } from 'vitest';
import Usercontroller from '../../controllers/user.controller.js';
import prisma from '../../database/prismaClient.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
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
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', canConnect: true };
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

  it('devrait retourner 401 si l\'utilisateur n\'existe pas', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await Usercontroller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Combinaison email / password incorrecte" });
  });

  it('devrait retourner 401 si le mot de passe est incorrect', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, password: 'hashed', canConnect: true });
    bcryptjs.compare.mockResolvedValue(false);

    await Usercontroller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Combinaison email / password incorrecte" });
  });
});


describe('Usercontroller.signup', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: 'new@example.com', password: 'Password1!', passwordConfirmation: 'Password1!', username: 'newuser' },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('retourne 400 si email/password manquants', async () => {
    req.body = { email: '', password: '' };
    await Usercontroller.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 400 si mot de passe trop court', async () => {
    req.body = { email: 'a@b.com', password: 'short', passwordConfirmation: 'short', username: 'u' };
    await Usercontroller.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 400 si les mots de passe ne correspondent pas', async () => {
    req.body = { email: 'a@b.com', password: 'Password1!', passwordConfirmation: 'Password2!', username: 'u' };
    await Usercontroller.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retourne 409 si l\'email existe déjà', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'new@example.com' });
    await Usercontroller.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('crée un utilisateur et retourne 201', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: '2', email: 'new@example.com', username: 'newuser' });
    await Usercontroller.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
