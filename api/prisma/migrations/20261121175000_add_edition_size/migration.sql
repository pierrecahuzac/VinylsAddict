-- Nombre d'exemplaires de l'édition (album) et de la copie possédée (UserAlbum).
-- Champs optionnels : migration additive, aucune donnée existante n'est modifiée.
ALTER TABLE "Album" ADD COLUMN "editionSize" INTEGER;
ALTER TABLE "UserAlbum" ADD COLUMN "editionSize" INTEGER;
