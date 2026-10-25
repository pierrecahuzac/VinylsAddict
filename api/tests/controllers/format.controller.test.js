import { describe, it, expect, vi, beforeEach } from 'vitest';
import FormatController from '../../controllers/format.controller.js';
import { FormatService } from '../../services/format.service.js';

vi.mock('../../services/format.service.js', () => ({
  FormatService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('FormatController.deleteFormat', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'f1' }, body: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  it('returns 404 when format does not exist', async () => {
    FormatService.getById.mockResolvedValue(null);
    await FormatController.deleteFormat(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 409 when format is still referenced (P2003)', async () => {
    FormatService.getById.mockResolvedValue({ id: 'f1' });
    const error = new Error('foreign key');
    error.code = 'P2003';
    FormatService.delete.mockRejectedValue(error);
    await FormatController.deleteFormat(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('returns 200 when deletion succeeds', async () => {
    FormatService.getById.mockResolvedValue({ id: 'f1' });
    FormatService.delete.mockResolvedValue({ id: 'f1' });
    await FormatController.deleteFormat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
