# OPTIMISATIONS.md — Optimisations performance (suite)

## Contexte

Suite aux optimisations déjà documentées (`PERFORMANCE.md` nginx, `CACHING.md` Redis, `CADDY.md` Caddy) : voici les optimisations complémentaires dans le même esprit.

## Optimisations proposées

### 1. Cache HTTP navigateur / CDN
- Ajout de `Cache-Control: public, max-age=...` sur les routes GET du catalogue (albums publics, genres, styles...).
- Combinable avec un CDN (Cloudflare, etc.).

### 2. Compression
- Ajout du middleware `compression` (gzip / brotli) sur les réponses JSON de l'API.

### 3. Optimisation des images uploads
- Côté Sharp : resize côté serveur (ex : dimension max) + qualité WebP adaptée, pour réduire le poids des photos des vinyles.

## Verdict

- Faisables, simples, sans impact fonctionnel majeur.

---

*Document créé dans la continuité des optimisations performance (`PERFORMANCE.md`, `CACHING.md`, `CADDY.md`).*
