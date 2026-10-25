-- Add unique constraint to prevent duplicate UserAlbum
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_userId_albumId_key" UNIQUE ("userId", "albumId");

-- Add indexes for performance
CREATE INDEX "UserAlbum_userId_idx" ON "UserAlbum"("userId");
CREATE INDEX "Album_userId_idx" ON "Album"("userId");
