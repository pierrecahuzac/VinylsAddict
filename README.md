# Vinyls Addict

Application web de gestion de collection de vinyles : catalogue communautaire, collection personnelle (état, prix, photos, dédicace) et liste de souhaits.

Fonctionnalités principales : gestion de collection, wishlist, catalogue, scan de codes-barres (camera) avec auto-remplissage Discogs, métadonnées (genre, style, format, variante, condition).

## Sommaire

- [Stack](#stack)
- [Structure du dépôt](#structure-du-dépôt)
- [Prérequis](#prérequis)
- [Démarrage rapide (Docker)](#démarrage-rapide-docker)
- [Démarrage manuel](#démarrage-manuel)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Tests et qualité](#tests-et-qualité)
- [API](#api)
- [Déploiement](#déploiement)
- [Documentation](#documentation)

## Stack

| Partie | Technologies |
|---|---|
| `api/` | Node.js 22, Express 5, Prisma 6, PostgreSQL, JWT (cookie httpOnly), bcryptjs, Sharp, Multer, Helmet, CORS, rate-limit |
| `app/` | React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, Axios, PWA (`vite-plugin-pwa`) |
| `landing/` | Astro 5, Tailwind CSS |

## Structure du dépôt

```text
.
├── api/                 # API REST Express + Prisma
│   ├── controllers/     # Couche HTTP
│   ├── services/        # Accès données / logique (album, collection, métadonnées, wishlist)
│   ├── middleware/      # auth, admin, erreurs, upload
│   ├── routers/         # Définition des routes
│   ├── prisma/          # schema.prisma, migrations, seed
│   ├── tests/           # Vitest (unitaires + e2e légers)
│   ├── server.js        # Point d'entrée
│   └── Dockerfile
├── app/                 # SPA React
│   ├── src/pages/       # Pages (catalogue, collection, wishlist, profil, dashboard...)
│   ├── src/components/  # Composants réutilisables
│   ├── src/contexts/    # Contexte utilisateur
│   ├── src/hooks/       # Hooks (collection, toast)
│   └── src/types/       # Types TypeScript
├── landing/             # Site vitrine Astro
├── docker-compose.yml
└── .github/workflows/   # CI
```

## Prérequis

- Node.js 22 et npm
- Docker et Docker Compose (optionnel mais recommandé)
- Une base PostgreSQL (locale via Docker ou distante type Neon)

## Démarrage rapide (Docker)

1. Créer le fichier d'environnement à la racine :

   ```bash
   cp .env.example .env
   ```

   Renseigner au minimum : `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`.

2. Créer `api/.env` à partir de `api/.env.example` et `app/.env` à partir de `app/.env.example`.

3. Lancer la stack :

   ```bash
   docker compose up --build
   ```

Services exposés :

| Service | URL / port |
|---|---|
| App React | http://localhost:55173 |
| API | http://localhost:33000/api |
| Landing Astro | http://localhost:44321 |
| PostgreSQL | `localhost:55432` |
| Prisma Studio (profil `dev`) | http://localhost:55555 |
| DB de test (profil `dev`) | `localhost:55433` |

Le conteneur `api` exécute automatiquement `prisma generate`, `prisma migrate deploy` puis le seed avant de démarrer.

## Démarrage manuel

### API

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run nodemon
```

L'API écoute sur `http://localhost:33000` (variable `PORT`).

### Frontend

```bash
cd app
npm install
npm run dev
```

Configurer `app/.env` :

```dotenv
VITE_BACKEND_URL_DEV=http://localhost:33000/api
```

### Landing

```bash
cd landing
npm install
npm run dev
```

## Variables d'environnement

### Racine (`.env`) — utilisé par Docker Compose

```dotenv
NODE_ENV=development
FRONTEND_URL=
DATABASE_URL=
POSTGRES_URL=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
JWT_SECRET=
AUTHORIZED_IPS=
DEV_USER_PASSWORD=
```

`AUTHORIZED_IPS` = origines front autorisées en développement, séparées par des virgules.
`FRONTEND_URL` = origines autorisées en production.

### API (`api/.env`)

```dotenv
DATABASE_URL=
POSTGRES_URL=
JWT_SECRET=
NODE_ENV=development
FRONTEND_URL=
AUTHORIZED_IPS=
DEV_USER_PASSWORD=
SYSTEM_USER_EMAIL=system@va.eu
SYSTEM_USERNAME=Système
```

Le schéma Prisma utilise `POSTGRES_URL`. `SYSTEM_USER_EMAIL` / `SYSTEM_USERNAME` désignent le compte système qui reçoit les albums lors de la suppression d'un utilisateur.

### Frontend (`app/.env`)

```dotenv
VITE_BACKEND_URL_DEV=http://localhost:33000/api
```

### Landing

`PUBLIC_APP_URL` est passé en argument de build Docker (défaut : `https://app.vinyls-addict.eu`).

## Base de données

Le schéma est dans `api/prisma/schema.prisma`.

```bash
cd api

# Développement : créer/appliquer une migration
npx prisma migrate dev --name nom_de_la_migration

# Production : appliquer les migrations existantes
npx prisma migrate deploy

# Régénérer le client
npx prisma generate

# Seed (genres, styles, conditions, formats, variantes, albums de démo)
npm run seed

# Explorer la base
npx prisma studio
```

Modèles principaux : `User`, `Album`, `UserAlbum`, `Wishlist`, `CollectionImage`, `Genre`, `Style`, `Condition`, `Format`, `VinylVariant`.

Contraintes notables :

- `UserAlbum` : unique sur `(userId, albumId)`.
- `Wishlist` : unique sur `(userId, albumId)`.
- `UserAlbum.signed` : booléen (vinyle dédicacé).

## Tests et qualité

```bash
# Backend
cd api
npm run test        # mode watch
npm run test:run    # exécution unique

# Frontend
cd app
npm run lint
npm run build       # inclut la vérification TypeScript
```

La CI GitHub Actions (`.github/workflows/ci.yml`) exécute les tests backend et le build frontend sur les branches `dev` et `main`, ainsi que sur les pull requests.

## API

Préfixe : `/api`.

| Ressource | Routes principales |
|---|---|
| Albums | `GET /albums`, `GET /albums/:id`, `POST /albums`, `PUT /albums/:id`, `DELETE /albums/:id` |
| Collection | `POST /collections/:albumId`, `PUT /collections/:userAlbumId`, `DELETE /collections/:userAlbumId`, `POST /collections/:userAlbumId/images`, `DELETE /collections/:userAlbumId/images/:imageId` |
| Wishlist | `GET /wishlists`, `POST /wishlists/:id`, `DELETE /wishlists/:id`, `GET /wishlists/albums/check/:id` |
| Utilisateurs | `POST /users/signup`, `POST /users/login`, `POST /users/logout`, `GET /users/checkToken`, `POST /users/changePassword`, `DELETE /users/me`, `GET /users/albums`, `GET /users/albums/:id` |
| Admin utilisateurs | `GET /users`, `GET /users/:id`, `PUT /users/:id/role`, `PUT /users/:id/status` |
| Métadonnées | `GET /metadatas` ; CRUD admin sur `/genres`, `/styles`, `/conditions`, `/formats`, `/variants` |

Authentification : cookie `va_token` (JWT httpOnly). Les routes admin nécessitent le rôle `ADMIN`.

## Déploiement

- **API** : Render (branche `main`, Dockerfile `api/`). La commande `npm start` résout les migrations éventuellement échouées puis exécute `prisma migrate deploy` avant de lancer `server.js`.
- **Base** : PostgreSQL managé (Neon).
- **Frontend (`app/`)** : Vercel (Root Directory: `app`, framework Vite, build `npm run build`, output `dist`).
- **Landing (`landing/`)** : Vercel (Root Directory: `landing`, framework Astro, build `npm run build`, output `dist`).

### Vercel

Le frontend et l'API sont deux domaines distincts : Vercel héberge le front, Render héberge l'API. Aucune URL de backend n'est codée en dur dans le dépôt ; elle est fournie à Vercel via une variable d'environnement de build :

- `VITE_BACKEND_URL_DEV=https://<api>.onrender.com/api` (ou le domaine API personnalisé)

Côté Render, ajouter le domaine Vercel à `FRONTEND_URL` (valeurs séparées par des virgules si plusieurs origines). L'API accepte les cookies cross-origin (`SameSite=None; Secure`) et CORS avec credentials.

`app/vercel.json` et `landing/vercel.json` fournissent les configurations de déploiement pour Vercel (respectivement fallback SPA pour React et build statique pour Astro).

Variables à définir en production : `POSTGRES_URL`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`, `SYSTEM_USER_EMAIL`, `SYSTEM_USERNAME` côté Render, et `VITE_BACKEND_URL_DEV` côté Vercel.

## Documentation

- `CONTEXT.md` : contexte projet et modèles.
- `CAHIER_DES_CHARGES.md` : cahier des charges fonctionnel.

Les notes personnelles (`TODO.md`, `INCOHERENCES.md`, `REVUE_CODE.md`, `UPDATE.md`) sont volontairement ignorées par Git.
