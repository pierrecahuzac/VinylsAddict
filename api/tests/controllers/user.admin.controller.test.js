import { describe, it, expect, vi, beforeEach } from 'vitest';
import Usercontroller from '../../controllers/user.controller.js';
import { deleteUserAndAnonymize } from '../../services/user.service.js';

vi.mock('../../database/prismaClient.js', () => ({ default: {} }));
vi.mock('../../services/user.service.js', () => ({
  deleteUserAndAnonymize: vi.fn(),
}));

describe('Usercontroller.adminDeleteUser', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'target' }, userId: 'admin' };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('refuse la suppression de son propre compte via l’admin', async () => {
    req.params.id = 'admin';

    await Usercontroller.adminDeleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(deleteUserAndAnonymize).not.toHaveBeenCalled();
  });

  it('retourne 404 si la cible n’existe pas', async () => {
    deleteUserAndAnonymize.mockResolvedValue({ ok: false, status: 404, message: 'Utilisateur introuvable' });

    await Usercontroller.adminDeleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('supprime et anonymise un utilisateur', async () => {
    deleteUserAndAnonymize.mockResolvedValue({ ok: true, albumsAnonymized: 3 });

    await Usercontroller.adminDeleteUser(req, res);

    expect(deleteUserAndAnonymize).toHaveBeenCalledWith('target');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ albumsAnonymized: 3 }));
  });
});
