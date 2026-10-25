import prisma from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const SYSTEM_USER_EMAIL = process.env.SYSTEM_USER_EMAIL || "system@va.eu";
const SYSTEM_USERNAME = process.env.SYSTEM_USERNAME || "Système";

export async function getOrCreateSystemUser() {
  const hashed = await bcryptjs.hash(randomUUID(), 10);
  return prisma.user.upsert({
    where: { email: SYSTEM_USER_EMAIL },
    update: { canConnect: false },
    create: {
      email: SYSTEM_USER_EMAIL,
      username: SYSTEM_USERNAME,
      password: hashed,
      canConnect: false,
      role: "USER",
    },
  });
}

export async function deleteUserAndAnonymize(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { ok: false, status: 404, message: "Utilisateur introuvable" };
  }
  if (user.email === SYSTEM_USER_EMAIL) {
    return { ok: false, status: 403, message: "Le compte système ne peut pas être supprimé." };
  }

  const systemUser = await getOrCreateSystemUser();
  if (systemUser.id === userId) {
    return { ok: false, status: 403, message: "Le compte système ne peut pas être supprimé." };
  }

  const userAlbums = await prisma.userAlbum.findMany({
    where: { userId },
    include: { images: true },
  });

  const anonResult = await prisma.$transaction(async (tx) => {
    const updated = await tx.album.updateMany({
      where: { userId },
      data: { userId: systemUser.id },
    });
    await tx.user.delete({ where: { id: userId } });
    return updated;
  });

  for (const userAlbum of userAlbums) {
    for (const image of userAlbum.images) {
      try {
        const filePath = path.join(process.cwd(), image.url.replace(/^\//, ""));
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Fichier non supprimé: ${image.url}`, error.message);
      }
    }
  }

  return {
    ok: true,
    albumsAnonymized: anonResult.count,
    systemUserId: systemUser.id,
  };
}
