-- Rename system user email from system@vinyls-addict.internal to system@va.eu
UPDATE "User" SET email = 'system@va.eu', "updatedAt" = NOW() WHERE email = 'system@vinyls-addict.internal';
-- Ensure system@va.eu exists if previous migration was never applied (idempotent)
INSERT INTO "User" (id, email, username, password, role, "canConnect", "createdAt", "updatedAt")
VALUES ('a0000000-0000-4000-a000-000000000001', 'system@va.eu', 'Système', '$2b$10$RikhL.p/JR05nEoK9t1qIu157BuZyoZVjwpPRF.a/P6ybovReZ3by', 'USER', false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
