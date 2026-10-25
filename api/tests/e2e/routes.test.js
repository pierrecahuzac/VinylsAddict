import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import mainRouter from '../../routers/index.js';

vi.mock('../../database/prismaClient.js', () => ({
  default: {
    album: { findMany: vi.fn().mockResolvedValue([]) },
    user: { findUnique: vi.fn() },
  },
}));

describe('E2E routes', () => {
  const app = express();
  app.use(express.json());
  app.use(mainRouter);

  it('GET / returns welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/albums returns 200', async () => {
    const res = await request(app).get('/api/albums');
    expect(res.status).toBe(200);
  });

  it('POST /api/albums without auth returns 401', async () => {
    const res = await request(app).post('/api/albums').send({ title: 'T' });
    expect(res.status).toBe(401);
  });

  it('GET /api/users without auth returns 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});
