import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscogsController } from '../../controllers/discogs.controller.js';
import { DiscogsService } from '../../services/discogs.service.js';

vi.mock('../../services/discogs.service.js', () => ({
  DiscogsService: {
    search: vi.fn(),
    getRelease: vi.fn(),
    getEditions: vi.fn(),
    getImage: vi.fn(),
  },
}));

describe('DiscogsController', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, params: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  it('search retourne 400 si q est manquant', async () => {
    await DiscogsController.search(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Le paramètre de recherche 'q' est requis." });
  });

  it('search appelle le service et retourne les résultats', async () => {
    req.query = { q: 'Daft Punk' };
    DiscogsService.search.mockResolvedValue({ results: [] });

    await DiscogsController.search(req, res);
    expect(DiscogsService.search).toHaveBeenCalledWith({ query: 'Daft Punk', type: undefined, page: undefined, per_page: undefined });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ results: [] });
  });

  it('getRelease retourne 400 si id est manquant', async () => {
    await DiscogsController.getRelease(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "L'identifiant de la release est requis." });
  });

  it('getRelease appelle le service et retourne la release', async () => {
    req.params = { id: '123' };
    DiscogsService.getRelease.mockResolvedValue({ id: 123, title: 'Album' });

    await DiscogsController.getRelease(req, res);
    expect(DiscogsService.getRelease).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 123, title: 'Album' });
  });

  it('getEditions retourne 400 si ids est manquant', async () => {
    await DiscogsController.getEditions(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Le paramètre 'ids' est requis." });
  });

  it('getEditions ignore les identifiants invalides et retourne les éditions', async () => {
    req.query = { ids: '123,abc,456' };
    DiscogsService.getEditions.mockResolvedValue([{ id: 123, color: 'Blue' }]);

    await DiscogsController.getEditions(req, res);
    expect(DiscogsService.getEditions).toHaveBeenCalledWith(['123', '456']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ editions: [{ id: 123, color: 'Blue' }] });
  });
});
