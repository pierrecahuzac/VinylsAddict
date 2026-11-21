# Suivi du déploiement VPS — Vinyls Addict

> Dernière mise à jour : 2026-11-21
> Branche : `feat/vps-deployment` · Tag : `v1.0.0` · VPS : `45.90.160.147`

## ✅ Terminé

### Code & configuration
- [x] `docker-compose.yml` production (db, api, app, landing, caddy)
- [x] `app/Dockerfile` multi-stage (build Vite + `vite preview`)
- [x] `landing/Dockerfile` multi-stage (Astro + nginx)
- [x] `Caddyfile` (reverse proxy + TLS auto Let's Encrypt)
- [x] Uploads absolus : `${API_URL}/uploads/...` (`collection.controller.js`)
- [x] **Fusion des `.env` en un seul fichier racine** (`.env` / `.env.example`)
  - `api/.env`, `app/.env`, `landing/.env` supprimés
  - `docker-compose.yml` : `env_file: .env`
- [x] `DEPLOYMENT_VPS.md` (plan complet)

### CI/CD GitHub Actions (`.github/workflows/cd.yml`)
- [x] Parsing YAML corrigé (retiré `build-args` → defaults dans Dockerfiles)
- [x] Tags Docker en minuscules (`ghcr.io/pierrecahuzac/vinylsaddict/...`)
- [x] `docker/login-action` ajouté (fix 403 GHCR)
- [x] **Build & push : ✅ RÉUSSI** (api, app, landing)
- [x] Secrets GitHub : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`

### VPS
- [x] Docker installé
- [x] Repo cloné dans `/srv/vinyls_addict` (branche `feat/vps-deployment`)
- [x] Clé SSH déployée (connexion OK)

## ❌ En cours / bloqué

- [ ] **Branche distante mise à jour** : le clone VPS était sur un ancien commit
      (avec placeholder `<org>` dans les images) → **`git pull` requis sur le VPS**
- [ ] **`.env` de production sur le VPS** : recréer avec les valeurs prod
      (cf. `.env.example` — NODE_ENV=production, URLs HTTPS, mdp fort DB)
- [ ] **`docker compose up -d --build`** sur le VPS
- [ ] **Job `deploy` CD** : `docker compose pull api app landing && docker compose up -d`
- [ ] **DNS** (Infomaniak + Cloudflare) :
  - `partagetacollection.eu` → A → `45.90.160.147`
  - `app.partagetacollection.eu` → A → `45.90.160.147`
  - `api.partagetacollection.eu` → A → `45.90.160.147`
- [ ] **TLS** : Caddy gère Let's Encrypt (ports 80/443 ouverts, UFW)
- [ ] **Vérifs post-déploiement** (plan §9)

## ▶️ Prochaine étape

Sur le VPS :
```bash
cd /srv/vinyls_addict
git pull origin feat/vps-deployment
cp .env.example .env   # puis éditer avec les valeurs production
docker compose up -d --build
docker compose ps
```

Puis relancer le workflow :
```bash
gh workflow run 419329931 --ref v1.0.0
```

## 📌 Notes

- **Domaine** : Infomaniak + Cloudflare (contournement CGNAT autre projet)
- **IP VPS** : `45.90.160.147`
- **Images GHCR** : `ghcr.io/pierrecahuzac/vinylsaddict/{api,app,landing}:latest`
- **Workflow CD** : déclenché sur tag `v*` ou `workflow_dispatch`
- Secrets GitHub : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
