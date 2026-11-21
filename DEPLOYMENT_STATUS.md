# Deployment Status — Vinyls Addict

**Date :** 2026-11-21  
**Tag :** `v1.0.0` (HEAD = remote = `b97c5a7`)  
**CD :** GitHub Actions `cd.yml` — build + deploy **vert**

## Services (VPS 45.90.160.147)

| Service | État | URL / port |
|---------|------|------------|
| db      | ✅ healthy | postgres:17-alpine |
| api     | ✅ healthy | `https://api.partagetacollection.eu` |
| app     | ✅ up | `https://app.partagetacollection.eu` |
| landing | ✅ up | `https://www.partagetacollection.eu` |
| caddy   | ✅ up | 80 / 443 |

## Vérifications externes

- `https://www.partagetacollection.eu` → **200** (landing, CTA → `app.partagetacollection.eu`)
- `https://app.partagetacollection.eu` → **200** (SPA)
- `https://api.partagetacollection.eu/` → **200** `{"message":"Bienvenue sur l'API de Vinyls Addict"}`
- `https://partagetacollection.eu` → **525** (AAAA racine proxied Cloudflare → autre projet ; non bloquant)

## Derniers correctifs

1. `app/Dockerfile` — copier `package.json` + `node_modules` + `vite.config.ts` dans la stage finale (`npm run preview`).
2. Healthcheck API — `fetch('http://127.0.0.1:33000/')` (racine, pas `/api`).
3. Landing sur `www.partagetacollection.eu` (conflit AAAA racine Cloudflare).
4. Vite `preview.allowedHosts` — `.partagetacollection.eu` (+ config copiée dans l'image).
5. Landing `PUBLIC_APP_URL` → `https://app.partagetacollection.eu` (build-time ARG).

## Notes

- Images GHCR : `ghcr.io/pierrecahuzac/vinylsaddict/{api,app,landing}:latest`
- Après un push tag `v*`, le CD rebuild + `docker compose pull/up` sur le VPS.
- Si une image change sans recreate : `docker compose up -d --force-recreate <svc>`.
