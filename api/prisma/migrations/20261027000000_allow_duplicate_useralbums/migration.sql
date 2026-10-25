-- Un utilisateur peut posséder plusieurs exemplaires du même album
-- (états, prix ou variants différents).
ALTER TABLE "UserAlbum" DROP CONSTRAINT IF EXISTS "UserAlbum_userId_albumId_key";
DROP INDEX IF EXISTS "UserAlbum_userId_albumId_key";

-- Préserver les performances des index auparavant couverts par la contrainte unique
CREATE INDEX IF NOT EXISTS "UserAlbum_userId_idx" ON "UserAlbum"("userId");
CREATE INDEX IF NOT EXISTS "UserAlbum_albumId_idx" ON "UserAlbum"("albumId");
CREATE INDEX IF NOT EXISTS "Album_userId_idx" ON "Album"("userId");
