-- Reassign CollectionImages from duplicate UserAlbum rows to the kept row
UPDATE "CollectionImage" ci
SET "userCollectionId" = kept.id
FROM "UserAlbum" ua
JOIN (
  SELECT "userId", "albumId", MIN(ctid) AS min_ctid
  FROM "UserAlbum"
  GROUP BY "userId", "albumId"
  HAVING COUNT(*) > 1
) dup ON ua."userId" = dup."userId" AND ua."albumId" = dup."albumId"
JOIN "UserAlbum" kept
  ON kept."userId" = dup."userId" AND kept."albumId" = dup."albumId"
 AND kept.ctid = dup.min_ctid
WHERE ci."userCollectionId" = ua.id
  AND ua.ctid <> dup.min_ctid;

-- Remove duplicate UserAlbum rows, keeping one per (userId, albumId)
DELETE FROM "UserAlbum"
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM "UserAlbum"
  GROUP BY "userId", "albumId"
);

-- Add unique constraint if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserAlbum_userId_albumId_key'
  ) THEN
    ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_userId_albumId_key" UNIQUE ("userId", "albumId");
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "UserAlbum_userId_idx" ON "UserAlbum"("userId");
CREATE INDEX IF NOT EXISTS "Album_userId_idx" ON "Album"("userId");
