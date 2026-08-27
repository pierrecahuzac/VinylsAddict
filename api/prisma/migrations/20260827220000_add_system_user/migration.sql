-- Create system user for anonymized albums (non-connectable)
-- Le compte système récupère la propriété des albums master dont le créateur supprime son compte.
-- canConnect=false empêche toute connexion, même avec un mot de passe valide.
-- Utilise un UUID fixe pour faciliter les tests ; la logique applicative (upsert) reste idempotente si la ligne existe déjà.
INSERT INTO "User" (id, email, username, password, role, "canConnect", "createdAt", "updatedAt")
VALUES ('a0000000-0000-4000-a000-000000000001', 'system@va.eu', 'Système', '$2b$10$RikhL.p/JR05nEoK9t1qIu157BuZyoZVjwpPRF.a/P6ybovReZ3by', 'USER', false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
