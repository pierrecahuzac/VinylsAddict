-- Remove duplicate UserAlbum rows before adding the unique constraint
DELETE FROM "UserAlbum" a
USING "UserAlbum" b
WHERE a."userId" = b."userId"
  AND a."albumId" = b."albumId"
  AND a.id > b.id;

-- Add unique constraint to prevent duplicate UserAlbum
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_userId_albumId_key" UNIQUE ("userId", "albumId");

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "UserAlbum_userId_idx" ON "UserAlbum"("userId");
CREATE INDEX IF NOT EXISTS "Album_userId_idx" ON "Album"("userId");
