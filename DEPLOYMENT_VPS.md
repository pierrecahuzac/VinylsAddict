# Déploiement VPS — Vinyls Addict

Documentation de déploiement sur un VPS SAPI.net (Debian 12) avec **Caddy** (reverse proxy + static), **Docker Compose** et **CICD GitHub**.

> Contexte : le projet était déployé sur Vercel (front + landing) / Render (API) / Neon (DB).
> Cible VPS : SAPI.net, Debian 12, DB sur le VPS, Caddy comme reverse proxy unique.

## 1. Architecture cible

### 1.1 Domaines

| Domaine | Rôle |
|---|---|
| `partagetacollection.eu` | Landing (Astro static) |
| `app.partagetacollection.eu` | Frontend (React SPA) — reverse proxy `/api/*` + `/uploads/*` → API |
| `api.partagetacollection.eu` | API (Express) — reverse proxy → `api` container |

> **Note :** Pour l'instant, **pas de nom de domaine dédié pour le projet** (décision liée à l'attente du MVP) ; tout reste sous `partagetacollection.eu` (landing / front / api). Un NDD dédié pourra être souscrit plus tard si le MVP aboutit.

### 1.2 Flux

```
Navigateur
  → https://partagetacollection.eu            (Caddy → landing:80)
  → https://app.partagetacollection.eu        (Caddy → app:55173, /api/* + /uploads/* → api:33000)
  → https://api.partagetacollection.eu            (Caddy → api:33000)
```

Caddy gère le TLS (Let's Encrypt, `automatic_https`) sur les 3 domaines.

### 1.3 Stack Docker (un seul compose)

Services : `db`, `api`, `app`, `landing`, `caddy`.

- `db` : `postgres:17-alpine` (volume `db_data`)
- `api` : build `./api` → `npm start` (migrations Prisma + `node server.js`)
- `app` : build `./app` (multi-stage, build Vite + `vite preview`) → `app:55173`
- `landing` : build `./landing` (nginx, multi-stage) → `landing:80`
- `caddy` : image `caddy:2-alpine`, ports `80:80` + `443:443`

## 2. Caddyfile

```caddyfile
{
	email admin@partagetacollection.eu
}

partagetacollection.eu {
	reverse_proxy landing:80
}

app.partagetacollection.eu {
	handle /api/* {
		reverse_proxy api:33000
	}

	handle /uploads/* {
		reverse_proxy api:33000
	}

	handle {
		reverse_proxy app:55173
	}
}

api.partagetacollection.eu {
	reverse_proxy api:33000
}
```

## 3. docker-compose.yml (VPS)

```yaml
services:
  db:
    container_name: db
    image: postgres:17-alpine
    restart: always
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    container_name: api
    build: ./api
    image: ghcr.io/<org>/vinyls_addict/api:latest
    restart: always
    env_file:
      - ./api/.env
    environment:
      - DISCOGS_USER_AGENT=${DISCOGS_USER_AGENT:-VinylsAddict/1.0}
      - DISCOGS_TOKEN=${DISCOGS_TOKEN:-}
    command: ["npm", "start"]
    volumes:
      - api_uploads:/api/uploads
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test:
        - CMD
        - node
        - -e
        - "fetch('http://127.0.0.1:33000/api').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

  app:
    container_name: app
    build:
      context: ./app
      args:
        VITE_BACKEND_URL_DEV: ${VITE_BACKEND_URL_DEV}
    image: ghcr.io/<org>/vinyls_addict/app:latest
    restart: always

  landing:
    container_name: landing
    build:
      context: ./landing
      args:
        PUBLIC_APP_URL: ${PUBLIC_APP_URL:-https://partagetacollection.eu}
    image: ghcr.io/<org>/vinyls_addict/landing:latest
    restart: always

  caddy:
    container_name: caddy
    image: caddy:2-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      api:
        condition: service_healthy
      app:
        condition: service_started
      landing:
        condition: service_started

volumes:
  db_data:
  api_uploads:
  caddy_data:
  caddy_config:
```

> `api_uploads` : volume persistant pour les uploads photos (`/api/uploads`).

## 4. Variables d'environnement

### 4.1 `.env` (racine — compose, substitution)

```env
NODE_ENV=production
PUBLIC_APP_URL=https://app.partagetacollection.eu

POSTGRES_USER=postgres
POSTGRES_PASSWORD=<mdp>
POSTGRES_DB=vinyls_addict

JWT_SECRET=<secret>
DISCOGS_USER_AGENT=VinylsAddict/1.0
DISCOGS_TOKEN=<token>
VITE_BACKEND_URL_DEV=https://api.partagetacollection.eu/api
```

### 4.2 `api/.env`

```env
DATABASE_URL=postgresql://postgres:<mdp>@db:5432/vinyls_addict
POSTGRES_URL=postgresql://postgres:<mdp>@db:5432/vinyls_addict
JWT_SECRET=<secret>
NODE_ENV=production
FRONTEND_URL=https://app.partagetacollection.eu
AUTHORIZED_IPS=
DEV_USER_PASSWORD=<mdp>
SYSTEM_USER_EMAIL=system@va.eu
SYSTEM_USERNAME=Système
DISCOGS_USER_AGENT=VinylsAddict/1.0
DISCOGS_TOKEN=<token>
API_URL=https://api.partagetacollection.eu
```

### 4.3 Build frontend (compose `args`)

- `VITE_BACKEND_URL_DEV=https://api.partagetacollection.eu/api` (build-time, injecté dans le bundle)
- `PUBLIC_APP_URL=https://partagetacollection.eu` (landing)

## 5. Modifications préalables côté code (à valider avant déploiement)

1. **`app/Dockerfile`** : passage en build production (multi-stage) :

   ```dockerfile
   FROM node:22-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   ARG VITE_BACKEND_URL_DEV
   ENV VITE_BACKEND_URL_DEV=$VITE_BACKEND_URL_DEV
   RUN npm run build

   FROM node:22-alpine
   WORKDIR /app
   COPY --from=build /app/dist ./dist
   EXPOSE 55173
   CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "55173"]
   ```

2. **`api/controllers/collection.controller.js`** : les URLs d'uploads doivent être absolues :

   ```js
   const imageUrl = `${process.env.API_URL}/uploads/${filename}`;
   ```

3. **Rate limit** : en production, l'API est limitée à **100 req / 15 min** (global) — à surveiller côté MVP.

## 6. Procédure de déploiement manuel (VPS)

```bash
# 1. SSH dans le VPS
ssh root@<vps-ip>

# 2. Installer Docker (Debian 12)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER && newgrp docker

# 3. Cloner / placer le repo
cd /srv
git clone <repo-url> vinyls-addict
cd vinyls-addict

# 4. Fichiers de config
cp .env.example .env / # puis éditer (voir §4)
cp api/.env.example api/.env / # puis éditer (voir §4.2)
cp app/.env.example app/.env / # puis éditer (VITE_BACKEND_URL_DEV)

cp Caddyfile /etc/caddy/Caddyfile   # ou monter via compose
# docker compose monte ./Caddyfile en volume

# 5. Démarrer la stack
docker compose up -d --build

# 6. Vérifier
docker compose ps
docker compose logs -f api
docker compose logs -f caddy
```

### 6.1 Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

> **Note (données de test) :** La base sur le VPS doit être **vide** (fresh). Ne pas importer les données de test. Migrations via `npm start` ; seed uniquement si nécessaire (`npm run seed`). 

## 7. CICD GitHub — workflow CD

Fichier : `.github/workflows/cd.yml` (à créer)

```yaml
name: CD

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Build & push API
        uses: docker/build-push-action@v6
        with:
          context: ./api
          push: true
          tags: ghcr.io/${{ github.repository }}/api:latest

      - name: Build & push frontend
        uses: docker/build-push-action@v6
        with:
          context: ./app
          push: true
          tags: ghcr.io/${{ github.repository }}/app:latest
          build-args:
            VITE_BACKEND_URL_DEV: https://api.partagetacollection.eu/api

      - name: Build & push landing
        uses: docker/build-push-action@v6
        with:
          context: ./landing
          push: true
          tags: ghcr.io/${{ github.repository }}/landing:latest
          build-args:
            PUBLIC_APP_URL: https://partagetacollection.eu

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /srv/vinyls_addict
            docker compose pull api app landing
            docker compose up -d
```

Secrets GitHub à créer : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.

## 8. DNS & TLS

- `partagetacollection.eu` → A record → IP VPS (landing)
- `app.partagetacollection.eu` → A record → IP VPS (frontend)
- `api.partagetacollection.eu` → A record → IP VPS (API)
- Caddy renouvelle le TLS automatiquement (Let's Encrypt) — ports 80/443 ouverts.

## 9. Post-déploiement — vérifications

```bash
curl -I https://partagetacollection.eu          # landing
curl -I https://app.partagetacollection.eu      # SPA
curl -i https://api.partagetacollection.eu/api  # API (attendre 200 JSON)
curl -I https://app.partagetacollection.eu/uploads/<fichier>  # static
docker compose ps
docker compose logs -f
```

- Tester login / inscription / upload / scan en localement sur le VPS (IP/hostname accessible).
- PWA : le service worker part de `app.partagetacollection.eu`.

## 10. Sauvegardes

- DB : `docker exec db pg_dump -U postgres vinyls_addict > backup.sql` (volume `db_data`)
- Uploads : volume `api_uploads`
- Snapshot SAPI.net disponible (snapshots).

---

*Document de déploiement VPS — à compléter / ajuster selon les réponses au feu vert.*
