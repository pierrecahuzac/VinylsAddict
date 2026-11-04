import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mainRouter from "../../routers/index.js";
import prisma from "../../database/prismaClient.js";

vi.mock("../../database/prismaClient.js", () => ({
  default: {
    album: { findMany: vi.fn().mockResolvedValue([]) },
    user: { findUnique: vi.fn() },
    userAlbum: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    collectionImage: { count: vi.fn(), create: vi.fn(), delete: vi.fn(), findUnique: vi.fn() },
  },
}));

describe("E2E routes", () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(mainRouter);

  const userId = "e2e-user-id";
  const userAlbumId = "e2e-user-album-id";
  let token;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = process.env.JWT_SECRET || "ma_sup3r_cl3_d3_t3st!";
    token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  it("GET / returns welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/albums returns 200", async () => {
    const res = await request(app).get("/api/albums");
    expect(res.status).toBe(200);
  });

  it("POST /api/albums without auth returns 401", async () => {
    const res = await request(app).post("/api/albums").send({ title: "T" });
    expect(res.status).toBe(401);
  });

  it("GET /api/users without auth returns 401", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });

  it("DELETE /api/collections/:userAlbumId deletes an owned album", async () => {
    prisma.userAlbum.findUnique.mockResolvedValue({ id: userAlbumId, userId, images: [] });
    prisma.userAlbum.delete.mockResolvedValue({ id: userAlbumId });

    const res = await request(app)
      .delete(`/api/collections/${userAlbumId}`)
      .set("Cookie", `va_token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Album supprimé de la collection.");
    expect(prisma.userAlbum.delete).toHaveBeenCalledWith({ where: { id: userAlbumId } });
  });

  it("DELETE /api/collections/:userAlbumId returns 404 when not owned", async () => {
    prisma.userAlbum.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .delete(`/api/collections/${userAlbumId}`)
      .set("Cookie", `va_token=${token}`);

    expect(res.status).toBe(404);
    expect(prisma.userAlbum.delete).not.toHaveBeenCalled();
  });
});
