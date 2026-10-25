# Cahier des Charges — Vinyls Addict

**Version:** 1.0 — 27/08/2026  
**Statut:** MVP fonctionnel (6.2/10 — cf. `REVUE_CODE.md:6`)  
**Auteur:** Analyse statique du codebase actuel (`dev` @ `712a3f1`)  
**Stack cible:** Node 22 / Express 5 / Prisma 6.4.1 / PostgreSQL 17 + React 19 / Vite 8 / TS 5.9 / Tailwind 4 / PWA

---

## Table des matières
1. [Objet & Contexte](#1-objet--contexte)
2. [Objectifs métier](#2-objectifs-métier)
3. [Périmètre](#3-périmètre)
4. [Acteurs & Rôles](#4-acteurs--rôles)
5. [Exigences fonctionnelles](#5-exigences-fonctionnelles)
6. [Modèle de données](#6-modèle-de-données)
7. [Architecture technique](#7-architecture-technique)
8. [Spécification API](#8-spécification-api)
9. [Spécification Frontend](#9-spécification-frontend)
10. [Exigences non fonctionnelles](#10-exigences-non-fonctionnelles)
11. [Sécurité & RGPD](#11-sécurité--rgpd)
12. [Infra, Déploiement & Environnements](#12-infra-déploiement--environnements)
13. [Parcours utilisateurs (UX)](#13-parcours-utilisateurs)
14. [Roadmap & Dette technique](#14-roadmap--dette-technique)
15. [Critères d'acceptation & Livrables](#15-critères-dacceptation--livrables)
16. [Hors périmètre (V2)](#16-hors-périmètre)
17. [Annexes — Références codebase](#17-annexes)

---

## 1. Objet & Contexte

Plateforme web pour passionnés de vinyle : gérer sa **collection personnelle**, sa **wishlist**, et parcourir un **catalogue mutualisé** d'albums.  
Le projet existe en MVP Dockerisé (`docker-compose.yml:1-85`) avec backend Express + Prisma et frontend React PWA. La landing Astro (`landing/`) est scaffold vide (`landing/.astro/` seul) — non livrée.

Document source : `CONTEXT.md:1-35`, `api/prisma/schema.prisma:1-141`, `app/src/App.tsx:19-42`.

---

## 2. Objectifs métier

| # | Objectif | KPI |
|---|----------|-----|
| O1 | Permettre à un collectionneur de centraliser ses vinyles (état, prix, photos) | Nb `UserAlbum` / user |
| O2 | Suivre les envies d'achat (wishlist) sans polluer la collection | Taux conversion wishlist → collection |
| O3 | Mutualiser le catalogue : un `Album` créé par un user reste visible par tous (Master) | Nb `Album` distincts |
| O4 | Anonymiser à la suppression de compte (RGPD) sans perte de données catalogue | 100% `Album.userId` → `system@va.eu` |
| O5 | Expérience mobile PWA installable, offline partiel | Score Lighthouse PWA |

---

## 3. Périmètre

### 3.1 Dans le périmètre MVP
- Auth JWT httpOnly, rôles USER/ADMIN (`api/prisma/schema.prisma:10-13`)
- Catalogue : CRUD Album + filtres `?artist` / `?title` + pages Artist/Versions (`api/controllers/album.controller.js:33-183`, `app/src/pages/Catalog|Artist|Versions`)
- Collection : `UserAlbum` + photos WebP + condition/prix/notes (`api/controllers/collection.controller.js:1-173`)
- Wishlist (`api/controllers/wishlist.controller.js:1-110`)
- Métadonnées : Genre/Style/Format/Condition/VinylVariant (`api/controllers/metadata.controller.js:1-32`)
- Admin Dashboard : gestion membres (`app/src/pages/Dashboard/index.tsx:1-329`)
- Stats perso : `MyStats` (`app/src/pages/MyStats/index.tsx:1-83`)
- Suppression de compte avec anonymisation (`api/controllers/user.controller.js:381-546`)

### 3.2 Hors périmètre V1
Voir §16. Recherche Discogs (`app/src/components/SearchBar/index.tsx:1-39` stub), marketplace, messages, OCR barcode.

---

## 4. Acteurs & Rôles

| Acteur | `User.role` | Droits |
|--------|-------------|--------|
| **Visiteur** | — | Consulter catalogue (`GET /albums`, `GET /albums/:id`), login/signup |
| **USER** | `USER` | + CRUD sa collection/wishlist/photos, créer des Albums, changer son mdp, supprimer son compte |
| **ADMIN** | `ADMIN` | + `GET /users`, `GET /users/:id`, `PUT /users/:id/status` (`canConnect`), `PUT /users/:id/role` (`api/routers/user.router.js:15-18`) |
| **Système** | `USER` `canConnect=false` | `system@va.eu` (`api/prisma/seed.ts:60-73`) — propriétaire des Albums anonymisés, non connectable, exclu des listes admin |

---

## 5. Exigences fonctionnelles

### 5.1 Authentification & Compte
| ID | Fonction | Détail | Source |
|----|----------|--------|--------|
| F-AUTH-01 | Inscription | email unique, username ≥2, password ≥8 + maj/min/chiffre/spécial (zod `app/src/contexts/userContext.tsx:30-56`), bcrypt 10 (`api/controllers/user.controller.js:42`) | `POST /users/signup` |
| F-AUTH-02 | Connexion | `POST /users/login`, vérif `canConnect` + bcrypt, JWT 1h, cookie `va_token` httpOnly/secure/sameSite/partitioned (`api/controllers/user.controller.js:70-95`) | `userContext.tsx:86-140` |
| F-AUTH-03 | Session | `GET /users/checkToken` + `GET /users/role`, middleware `AuthMiddleWare.checkToken` (`api/middleware/auth.middleware.js:5-25`) | `App.tsx` guard Dashboard |
| F-AUTH-04 | Déconnexion | `POST /users/logout` clearCookie | `userContext.tsx` |
| F-AUTH-05 | Changer mdp | `POST /users/changePassword` (auth) | `Profile/index.tsx:60-90` |
| F-AUTH-06 | Supprimer compte | `DELETE /users/me` : garde `system@va.eu` protégé, `getOrCreateSystemUser()` → `tx.album.updateMany userId→systemId` + `tx.user.delete`, unlink FS `uploads/*`, clear cookie, photos → `SetNull` via anonymisation | `user.controller.js:430-520`, `Profile/index.tsx:140-183` |
| F-AUTH-07 | Admin membres | Lister, voir détail, bannir (`canConnect=false`), promouvoir/rétrograder (`role`) | `Dashboard/index.tsx:140-280`, `user.controller.js:331-426` |

**Règles :** `Wishlist` `@@unique([userId, albumId])` empêche doublon wishlist (`wishlist.controller.js:34`). `UserAlbum` n'a pas encore `@@unique` (dette `REVUE_CODE.md:51` — risque doublon collection).

### 5.2 Catalogue (MasterAlbum)
| ID | Fonction | Détail |
|----|----------|--------|
| F-CAT-01 | Lister | `GET /albums` sans pagination (dette `REVUE_CODE.md:53`), filtre `?artist`/`?title` `mode:insensitive` `album.controller.js:33-50` |
| F-CAT-02 | Détail | `GET /albums/:id` include `format,genres,styles,vinylVariant` + strip `userId/creator` (anonymat) `album.controller.js:12-30` |
| F-CAT-03 | Créer | `POST /albums` (cookie `va_token` vérifié dans controller `album.controller.js:55-92`, pas via middleware — dette), tx `album.create` + opt `userAlbum.create` si `addAlbumToCollection:true`, génère `diskNumber/trackCount/formatId/genres/styles` |
| F-CAT-04 | Modifier/Suppr. | `PUT /albums/:id`, `DELETE /albums/:id` (`album.router.js:1-14`) — pas de check auth/owner actuel |
| F-CAT-05 | Versions | `GET /albums?title=` → groupe par titre (`Versions/index.tsx:1-127`) |
| F-CAT-06 | Artistes | `GET /albums?artist=` → groupe par artiste (`Artist/index.tsx:1-101`) |

Frontend : `Catalog/index.tsx:1-167` (liste + modale ajout), `MasterAlbum/index.tsx:1-308` (hero, actions Posséder/Wishlist), `Album/index.tsx:1-39` (card 80×80).

### 5.3 Collection personnelle
| ID | Fonction | Détail |
|----|----------|--------|
| F-COL-01 | Lister | `GET /users/albums` (auth, include `album, images, condition`) `user.controller.js:166-188` → `MyCollection/index.tsx:1-170` |
| F-COL-02 | Détail | `GET /users/albums/:id` (IDOR-safe `findFirst {id,userId}`) `user.controller.js:122-150` → `MyAlbumDetails/index.tsx:1-442` |
| F-COL-03 | Ajouter | `POST /collections/:albumId` body `price, conditionId` (`collection.controller.js:11-45`) ; UI via `MasterAlbum` bouton Posséder ou `Modale` `isCollectionContext=true` |
| F-COL-04 | Retirer | `DELETE /collections/:userAlbumId` (IDOR check + `fs.unlink` best-effort `collection.controller.js:47-78`) → `MyAlbumDetails/index.tsx:164` |
| F-COL-05 | Photos | `POST /collections/:userAlbumId/images` `upload.single('image')` memory + `sharp.rotate().webp({quality:85}).toFile('uploads/<uuid>.webp')` strip EXIF/GPS, limite 10 (`collection.controller.js:98-150`), `DELETE /collections/:userAlbumId/images/:imageId` ; UI grid 4 cols, lightbox, validation client MIME+5MB (`MyAlbumDetails/index.tsx:22-220`) |
| F-COL-06 | Check | `GET /users/albums/check/:id` → bool possédé |

### 5.4 Wishlist
| ID | Fonction | Détail |
|----|----------|--------|
| F-WISH-01 | Lister | `GET /wishlists` flatten `wishlistId + album` `wishlist.controller.js:12-26` → `MyWishlist/index.tsx:1-166` |
| F-WISH-02 | Ajouter/Retirer | `POST /wishlists/:id`, `DELETE /wishlists/:id` (composite `userId_albumId`) |
| F-WISH-03 | Toggle | `MasterAlbum/index.tsx:140-180` heart, `GET /wishlists/albums/check/:id` |

### 5.5 Métadonnées & Référentiels
`GET /metadatas` → `{genres (include styles), conditions, variants, formats, style}` (`metadata.controller.js:14-32`), `GET /genres`.  
Seed : 11 genres + styles, 8 conditions (Mint→Poor), 13 variants, 5 formats (`api/prisma/seedData.json:1-200`, `seed.ts:9-48`). Utilisés dans `Modale/index.tsx:1-253` selects.

### 5.6 Stats & Dashboard
- `MyStats/index.tsx:20-83` : calcul local `totalValue = sum(UserAlbum.price)`, cards collection/wishlist/valeur + placeholder.
- `Dashboard/index.tsx:1-329` : guard `GET /users/role` → redirect si non ADMIN, fetch `GET /albums` + `GET /users`, stats, liste membres, modale `PUT /users/:id/status|role`.

---

## 6. Modèle de données

`api/prisma/schema.prisma:1-141` — PostgreSQL, 10 modèles :

```
User 1—N Album (creator, onDelete:SetNull) // colonnes : id uuid, email @unique, username?, password hash, role USER|ADMIN, canConnect bool, timestamps
Album N—M Genre (AlbumGenres) , N—M Style (AlbumStyles) , N—1 Format (required), N—1 VinylVariant?, 1—N UserAlbum, 1—N Wishlist
  champs : title, artist, releaseDate Int?, coverUrl?, barCode?, color?, diskNumber?, trackCount?, userId? (FK creator)
UserAlbum (collection instance) : id, userId→User Cascade, albumId→Album Cascade, price Float?, boughtAt?, notes?, copyNumber?, conditionId?→Condition, images CollectionImage[] Cascade
Wishlist : id, userId, albumId @@unique([userId,albumId]) Cascade
CollectionImage : id, url, description?, userCollectionId→UserAlbum Cascade
Genre : id, name @unique, styles Style[]
Style : id, name @unique, genreId→Genre, albums M:N
Condition : id, nameEN @unique, nameFR?
Format : id, name @unique, speed?, description?
VinylVariant : id, nameEN @unique, nameFR?
```

Contraintes manquantes (dette) : `UserAlbum @@unique([userId,albumId])`, index `Album.userId`, `UserAlbum.userId` (`REVUE_CODE.md:66`).

---

## 7. Architecture technique

### 7.1 Vue d'ensemble
```
[ Browser PWA React 19 ] --HTTPS--> [ Express 5 :33000 ] --Prisma 6.4.1--> [ Postgres 17 :5432 ]
      | Vite 55173 + PWA Manifest                         | /uploads static / sharp WebP
      └─ landing Astro (vide)                              └─ JWT cookie va_token
```

### 7.2 Backend (`api/`)
- **Runtime :** `api/server.js:1-58` (JS actif) + `api/server.ts:1-35` doublon TS (dette `REVUE_CODE.md:38`). `trust proxy 1`, `helmet`, `cookieParser`, `express.json()`, `express.static('/uploads')`, CORS `credentials:true` (`AUTHORIZED_IPS` split en dev, `FRONTEND_URL` en prod `server.js:22-29`), errorHandler multer/sharp (`server.js:33-55`).
- **DB :** `api/database/prismaClient.js:3` singleton (dupliqué dans `metadata.controller.js:1` — dette).
- **Routers :** `api/routers/index.js:1-51` monte `/api/genres|albums|collections|users|metadatas|wishlists`, rateLimiter commenté (`index.js:14-38`).
- **Middleware :** `auth.middleware.js:5-25` (jwt verify → `req.userId`), `upload.middleware.js:3-19` (memoryStorage, `limits 5MB`, `ALLOWED_MIMES jpeg|png|webp|jpg` fileFilter) — livré 27/08 (`TODO.md:21-23`).
- **Services :** `api/services/album.services.js:1-93` duplique controller, non branché (`REVUE_CODE.md:39`).
- **Dépendances clés :** `express@5.2.1`, `helmet@8.1.0`, `cors@2.8.6`, `express-rate-limit@8.5.2`, `jsonwebtoken@9.0.3`, `bcryptjs@3.0.3`, `multer@2.2.0`, `sharp@0.35.4`, `axios@1.14.0`, `prisma@6.4.1` (`api/package.json:22-34`), scripts `npm run nodemon`, `prisma generate|migrate deploy|db seed` (`api/package.json:6-16`).

### 7.3 Frontend (`app/`)
- **Build :** Vite 8 + `@vitejs/plugin-react`, Tailwind 4.2.4 (`@tailwindcss/vite`), `vite-plugin-pwa` autoUpdate (`app/vite.config.ts:10-44`), `tsc -b && vite build` (`app/package.json:6-16`), TS 5.9 strict.
- **Routing :** `BrowserRouter` + `UserProvider` (`app/src/main.tsx:1-20`), routes `App.tsx:19-42` (Layout → Catalog `/`, Collection `/collection`, Wishlist `/wishlist`, Album `/album/:id`, Artist `/artist/:name`, Versions `/versions/:title`, Details `/collection/album/:albumId`, Stats `/my-stats`, Profile `/profile`, Dashboard `/dashboard` ADMIN, Login/Signup).
- **State :** `contexts/userContext.tsx:1-262` god-context (auth + form fields + navigation + toast + zod signupSchema) — dette (`REVUE_CODE.md:57`). `hooks/useCollection.ts:1-78` + `hooks/useToast.ts:1-35`, `functions/collectionFunctions.ts:1-13` stub.
- **UI :** `styles/index.css:1-30` (`@import tailwindcss`, `--color-primary #f1c40f`, Montserrat, dark `bg-gray-950` scrollbar 6px), `components/Album|Header|Layout|Modale|NavBar|SearchBar`, `react-icons@5.6.0`, `react-toastify@11.0.5` bottom-right, `react-router@7.13.2`, `zod@4.4.2`.
- **PWA :** manifest `Vinyls Addict` / `VA`, icons 64/192/512 maskable, `registerSW immediate` (`main.tsx:10`), pas de `runtimeCaching` API (dette `REVUE_CODE.md:61`).

### 7.4 Schémas des flux
**Auth :** `Login.tsx` → `userContext.login POST /users/login` → `Set-Cookie va_token httpOnly` → `checkToken GET /users/checkToken` → `Header` avatar + `NavBar` switch.  
**Création vinyle :** `Catalog FAB → Modale` (fetch `GET /metadatas`) → `POST /albums` (+ `addAlbumToCollection`) → toast → refresh.  
**Photo :** `MyAlbumDetails <input file>` → client check MIME/5MB/10 max → `POST /collections/:id/images FormData` → `sharp WebP` → `CollectionImage` → grid.

---

## 8. Spécification API

BaseURL : `VITE_BACKEND_URL_DEV` (`http://localhost:33000/api`) en dev, `FRONTEND_URL` en prod, proxy Vite `/api→33000` (`app/vite.config.ts:51-55`) inutilisé car URLs absolues (dette).

| Méthode | Route | Auth | Body / Query | Réponse | Controller |
|---------|-------|------|--------------|---------|------------|
| GET | `/` | — | — | `{message:"Bienvenue..."}` | `routers/index.js:8` |
| GET | `/albums` | — | `?artist&title` | `Album[]` (sans userId) | `album.controller.js:33` |
| GET | `/albums/:id` | — | — | `Album + format/genres/styles/variant` | `album.controller.js:12` |
| POST | `/albums` | cookie* | `{title,artist,releaseDate,coverUrl,barCode,color,diskNumber,trackCount,formatId,variantId,genreIds,styleIds,addAlbumToCollection,price,conditionId}` | `Album (+UserAlbum)` | `album.controller.js:50` |
| PUT | `/albums/:id` | — | `title/artist/year/color/coverUrl...` | `Album` | `album.controller.js:130` |
| DELETE | `/albums/:id` | — | — | `204` | `album.controller.js:160` |
| POST | `/collections/:albumId` | ✅ | `{price,conditionId}` | `UserAlbum` | `collection.controller.js:11` |
| DELETE | `/collections/:userAlbumId` | ✅ | — | `204 + unlink FS` | `collection.controller.js:47` |
| POST | `/collections/:userAlbumId/images` | ✅ | `multipart image` (≤5MB, jpeg/png/webp) | `CollectionImage` | `collection.controller.js:98` |
| DELETE | `/collections/:userAlbumId/images/:imageId` | ✅ | — | `204 + unlink` | `collection.controller.js:152` |
| GET | `/users/albums` | ✅ | — | `UserAlbum[]` include `album+images+condition` | `user.controller.js:166` |
| GET | `/users/albums/:id` | ✅ | — | `UserAlbum` (IDOR) | `user.controller.js:122` |
| GET | `/users/albums/check/:id` | ✅ | — | `{inCollection:bool}` | `user.controller.js:192` |
| POST | `/users/signup` | — | `{email,username,password}` | `201 User` | `user.controller.js:18` |
| POST | `/users/login` | — | `{email,password}` | `Set-Cookie va_token` | `user.controller.js:60` |
| POST | `/users/logout` | — | — | `clearCookie` | `user.controller.js:100` |
| GET | `/users/checkToken` | ✅ | — | `{userId}` | `user.controller.js:110` |
| GET | `/users/role` | ✅ | — | `{role}` | `user.controller.js:310` |
| POST | `/users/changePassword` | ✅ | `{old,new}` | `200` | `user.controller.js:230` |
| DELETE | `/users/me` | ✅ | — | `204` (anonymise + purge) | `user.controller.js:430` |
| GET | `/users` | ADMIN | — | `User[]` | `user.controller.js:340` |
| GET | `/users/:id` | ADMIN | — | `User` | `user.controller.js:360` |
| PUT | `/users/:id/status` | ADMIN | `{canConnect}` | `User` | `user.controller.js:380` |
| PUT | `/users/:id/role` | ADMIN | `{role}` | `User` | `user.controller.js:400` |
| GET | `/wishlists` | ✅ | — | `Wishlist[] flattened` | `wishlist.controller.js:12` |
| POST | `/wishlists/:id` | ✅ | — | `Wishlist` | `wishlist.controller.js:34` |
| DELETE | `/wishlists/:id` | ✅ | — | `204` | `wishlist.controller.js:60` |
| GET | `/wishlists/albums/check/:id` | ✅ | — | `{inWishlist}` | `wishlist.controller.js:85` |
| GET | `/genres` | — | — | `Genre[]` | `genre.controller.js:6` |
| GET | `/metadatas` | — | — | `{genres,conditions,variants,formats,style}` | `metadata.controller.js:14` |

* `POST /albums` vérifie `req.cookies.va_token` manuellement (pas `AuthMiddleWare`) — à uniformiser.

**Validation actuelle :** `parseInt/parseFloat` sans zod côté API (`album.controller.js:58-71`), `formatId` requis en DB (`schema.prisma:47`) mais optionnel en API (risque 500).

---

## 9. Spécification Frontend

### 9.1 Pages (`app/src/pages/**/index.tsx`)
| Route | Page | Accès | Source données |
|-------|------|-------|----------------|
| `/` | `Catalog` | public | `GET /albums`, `getAllMetadata` |
| `/artist/:name` | `Artist` | public | `GET /albums?artist=` |
| `/versions/:title` | `Versions` | public | `GET /albums?title=` |
| `/album/:id` | `MasterAlbum` | public (+actions si loggé) | `GET /albums/:id` + wishlist check |
| `/collection` | `MyCollection` | privé* | `GET /users/albums` |
| `/collection/album/:albumId` | `MyAlbumDetails` (UserDetailsAlbum) | privé | `GET /users/albums/:id` + images CRUD |
| `/wishlist` | `MyWishlist` | privé | `GET /wishlists` |
| `/my-stats` | `MyStats` | privé | `useCollection` + `GET /wishlists` (calc local) |
| `/profile` | `Profile` | privé | `UserContext` + `POST /users/changePassword` + `DELETE /users/me` |
| `/dashboard` | `Dashboard` | ADMIN | `GET /users/role` guard + `GET /users` + `GET /albums` |
| `/login` | `Login` | public | `UserContext.login` |
| `/signup` | `Signup` | public | `UserContext.signup` |

* Pas de `ProtectedRoute` (`REVUE_CODE.md:60`) — pages privées fetch 401 + flash si non loggé.

### 9.2 Composants (`app/src/components/`)
- `Album` : card 80×80, title/artist/year•color, `onClick` → détail.
- `Modale` (253 lignes) : form title/artist/coverUrl/barCode/year/trackCount/diskCount + selects format/variant/genre/style/color + checkbox collection + price/condition. Réutilisée Catalog & MyCollection.
- `Header` : logo → `/`, badge ADMIN `/dashboard`, avatar `username[0]` → `/profile`, logout.
- `NavBar` : bottom fixed 16h, switch `IoHome` | `IoLibrary`/`IoHeart`/`IoStatsChart` (loggé) vs `IoLogIn`/`IoPersonAdd` (visiteur).
- `Layout` : `flex-col h-svh`, `Header` + `main overflow-y-auto bg-gray-900` + `NavBar`.
- `SearchBar` : stub Discogs `api.discogs.com/database/search?token=TON_TOKEN` debounce 500ms ≥3 chars — non câblé.

### 9.3 State & Data fetching
- `userContext.tsx:70-225` : god-object (email/password/username/confirmation + login/signup/logout/checkToken/deleteAccount/navigate/toast).
- `useCollection.ts:9-78` : `allMetadata/isLoading` + `getAllMetadata/genres/albums/userAlbums` (axios direct `VITE_BACKEND_URL_DEV` répété 15×).
- `useToast.ts:1-35` : wrapper `react-toastify` (autoClose 1000, bottom-right).

Dette : axios non centralisé (pas d'instance `withCredentials`/interceptor 401), `collectionFunctions.ts:6` morte (`/user/albums` 404).

---

## 10. Exigences non fonctionnelles

| Catégorie | Exigence | État actuel |
|-----------|----------|-------------|
| Perf | Lister `GET /albums` paginé `?take=20&skip=` | ❌ Non impl. (`REVUE_CODE.md:53`) — future |
| PWA | Manifest `VA` standalone, icons 64/192/512 maskable, autoUpdate | ✅ `vite.config.ts:13-43`, `main.tsx:registerSW` ; ❌ pas de `runtimeCaching` API |
| Style | Tailwind 4 unifié, plus de Sass | ✅ Migré (`0693308`) — `styles/index.css:2-8` |
| Typage | TS strict front, JS ESM back | ⚠️ Hybride `server.js` vs `server.ts` (`REVUE_CODE.md:38`) |
| Tests | Vitest 4.1, 1 test mock `user.controller.test.js:1-66`, 0 intégration | ❌ Pas de CI, pas de `db_test:55433` branché |
| Accessibilité | Dark theme `gray-950/900/800` + `#f1c40f` primaire, Montserrat | Partiel |
| Upload | WebP 85% + EXIF strip + 5MB + MIME + uuid filename | ✅ Livré 27/08 (`TODO.md:21-23`, `collection.controller.js:98-108`, `upload.middleware.js:3-12`) |

---

## 11. Sécurité & RGPD

- **Auth :** bcrypt 10, JWT 1h `JWT_SECRET`, cookie `httpOnly` `secure` (prod `sameSite:none partitioned:true` `user.controller.js:84-89`), `helmet`, `trust proxy 1`.
- **RBAC :** checks `role===ADMIN` copiés 5× (`user.controller.js:331-426`) — à factoriser `requireAdmin`.
- **Upload :** `fileFilter` MIME, `limits.fileSize 5MB`, `memoryStorage` + sharp `rotate` (EXIF auto) + `webp` (strip GPS), filename `uuid.webp`, `.gitignore api/uploads/*`, `onDelete:Cascade` `CollectionImage` (`schema.prisma:138`).
- **RGPD suppression :** `DELETE /users/me` anonymise : `Album.userId → system@va.eu` (`canConnect=false`, pwd random `seed.ts:62`), `UserAlbum/Wishlist` purgés via Cascade, FS clean. **Ne jamais log `system@va.eu` + `Password123!`** — `DEV_USER_PASSWORD` est pour `dev@va.eu` local uniquement (`api/.env:DEV_USER_PASSWORD`).
- **Risques ouverts :** rate-limit commenté (`routers/index.js:14`), CORS fragile dev (`AUTHORIZED_IPS` vide bloque), `PUT/DELETE /albums` sans auth, `UserAlbum` doublon possible, `console.log` dispersés (P1 `REVUE_CODE.md:47-52`).

---

## 12. Infra, Déploiement & Environnements

**Docker Compose (`docker-compose.yml:1-85`)**
- `app` build `./app` : `55173:55173`, `depends_on api`
- `api` build `./api` : `33000:33000`, `env_file ./api/.env`, `command prisma generate && migrate deploy && db seed && nodemon`, `depends_on db healthy`
- `db` `postgres:17-alpine` : `5432→55432`, `healthcheck pg_isready`, volume `db_data`, `env_file .env`
- `db_test` profile `dev` : `5432→55433`, `env_file .env.test`
- `prisma-studio` profile `dev` : `5555→55555`, `npx prisma studio --hostname 0.0.0.0` (dev-only, lan `192.168.1.181:55555`)

**Env (`/.env.example:1-14`, `/api/.env.example:1-9`)**
- Communs : `DATABASE_URL`, `POSTGRES_URL`, `FRONTEND_URL`, `JWT_SECRET`, `AUTHORIZED_IPS`, `DEV_USER_PASSWORD`
- `SYSTEM_USER_EMAIL=system@va.eu`, `SYSTEM_USERNAME=Système` (non secret)
- `NODE_ENV=development|production`, `VITE_BACKEND_URL_DEV` côté app, `PUBLIC_APP_URL` landing
- Secrets : `.env` gitignoré (`api/.env` contient `DEV_USER_PASSWORD=Password123!` local — jamais commit, vérifié `git log -p` vide)

**CI/CD :** absent — recommandé `eslint --max-warnings 0 + tsc --noEmit + vitest run` sur PR, `husky` pré-commit (`REVUE_CODE.md:108`).

---

## 13. Parcours utilisateurs

**Visiteur → Inscrit**
`/` (Catalog) → `/signup` (zod) → `POST /users/signup 201` → `/login` → `POST /users/login` → cookie → `Header` avatar + `NavBar` collection/wishlist/stats.

**Créer un vinyle**
Catalog FAB+ → `Modale` (fetch `GET /metadatas`) → remplir title/artist/cover/year/format/genre/style/color/tracks/disks/barCode + checkbox Posséder (price/condition) → `POST /albums` → toast → redirect.

**Posséder un vinyle existant**
`MasterAlbum /album/:id` → Posséder → `Modale` price/condition → `POST /collections/:id` → `MyCollection`.

**Gérer sa collection**
`MyCollection` → card → `/collection/album/:userAlbumId` → voir prix/état/notes/genres → upload photo (jpeg/png/webp ≤5MB, max 10) → lightbox / delete → retirer collection → `DELETE /collections/:id`.

**Wishlist**
`MasterAlbum` heart → `POST /wishlists/:id` → `MyWishlist` liste + delete confirm → `DELETE /wishlists/:id`.

**Admin**
`/dashboard` (guard role) → stats users/albums → membres → clic → modale `PUT /users/:id/status|role`.

**Suppression RGPD**
`Profile` → Zone dangereuse → modale confirmation → `DELETE /users/me` → vinyles → `system@va.eu`, collection/wishlist purge, cookie clear → `/`.

---

## 14. Roadmap & Dette technique

Aligné `UPDATE.md:31-35` (3 phases) + `REVUE_CODE.md:90-112` + `TODO.md:26-38`.

### P0 — Bloquant prod (1 semaine) ✅ partiel
- [x] Upload sécurisé (fileFilter + limits + sharp WebP + gitignore) — livré 27/08
- [ ] Fix `server.ts` unique (suppr. `server.js` drift), typer `req.userId`, CORS array dev/prod
- [ ] `UserAlbum @@unique([userId,albumId])` + `@@index([userId])` + `Album @@index([userId])` + migration
- [ ] `asyncHandler` + `errorHandler` middleware, réactiver `rateLimit` (`routers/index.js:14`)
- [ ] Fix `MyAlbumDetails DELETE /users/albums` → `DELETE /collections/:id` (déjà noté `TODO.md:42`)

### P1 — Cœur (2-4 sem) — Phase 1 & 2 `UPDATE.md:32-33`
- [ ] Migrer BE TS strict, zod schemas `albumCreateSchema/signupSchema` partagés, `AlbumServices` source vérité
- [ ] Middleware `requireAuth` + `requireAdmin` (factoriser `user.controller.js:331-426`)
- [ ] Front : `axiosInstance` central (`withCredentials`, `VITE_API_URL`), `ProtectedRoute` (`App.tsx:21`), `TanStack Query`, `react-hook-form+zodResolver` pour `Modale`
- [ ] Shared types `packages/shared` → unifier `AlbumData` `app/src/types/album.ts:60-78`

### P2 — Qualité & Features (1 mois) — Phase 3 `UPDATE.md:34`
- [ ] Tests intégration `vitest+supertest` sur `db_test:55433` (`POST /albums`, collection, wishlist, deleteAccount), CI + husky
- [ ] Features backlog : update/delete collection, CRUD metadata admin, form création vinyle front, `Dashboard MyStats`, pagination `GET /albums?take&skip`
- [ ] PWA `runtimeCaching` `/api/albums` + `/api/metadatas` (`vite.config.ts`)

**Backlog détaillé `TODO.md:26-38` :** maj `collection.controller.js`, profil, stats, TS BE, Tailwind consolidation.

---

## 15. Critères d'acceptation & Livrables

| Livrable | Critère |
|----------|---------|
| **API** | Tous endpoints §8 passent `vitest` intégration + `POST /albums` sans `formatId` → 400 zod (pas 500) |
| **Collection** | Upload 10 photos WebP ≤5MB, EXIF nettoyé, delete FS+DB, limite 10 bloquée côté API |
| **Anonymisation** | `DELETE /users/me` → `Album.userId === system@va.eu` (uuid `a0000000-...0001`), `canConnect=false` bloque login même avec pwd valide |
| **Catalog** | `?artist`/`?title` insensible, `Versions` et `Artist` listent correctement, cover `max-h 480px` responsive |
| **PWA** | Installable, `manifest.json` icons, offline cache métadonnées |
| **Sécurité** | `helmet` + CORS credentials OK dev (`AUTHORIZED_IPS`) et prod (`FRONTEND_URL`), rate-limit actif, pas de `console.log` en prod |
| **Infra** | `docker compose up` → `db healthy` → `api migrate deploy` idempotent (pas de seed overwrite) → `app 55173` + `api 33000` + `studio 55555` (dev) |

---

## 16. Hors périmètre

- Marketplace / vente / paiement
- Chat / messages entre users
- Recherche externe Discogs auto (stub `SearchBar` non câblé)
- OCR barcode / import CSV
- Landing marketing Astro (à spécifier à part — `landing/` vide)
- Multi-langue complet (seuls `nameEN/nameFR` sur Condition/Variant)

---

## 17. Annexes

### 17.1 Arborescence clé
```
.
├── api/
│   ├── server.js (+ server.ts doublon)
│   ├── routers/{index,album,collection,user,wishlist,genre,metadata}.router.js
│   ├── controllers/{album,collection,user,wishlist,genre,metadata}.controller.js
│   ├── middleware/{auth,upload}.middleware.js
│   ├── services/album.services.js
│   ├── database/prismaClient.js
│   ├── prisma/{schema.prisma, seed.ts, seedData.json, migrations/20260827*}
│   └── uploads/ (.gitkeep + .webp)
├── app/
│   ├── vite.config.ts (react+tailwind+pwa+proxy)
│   ├── src/{App.tsx, main.tsx, styles/index.css, vite-env.d.ts}
│   ├── src/pages/{Catalog,MyCollection,MasterAlbum,MyAlbumDetails,MyWishlist,Artist,Versions,Profile,Dashboard,MyStats,Login,Signup}
│   ├── src/components/{Album,Header,Layout,Modale,NavBar,SearchBar}
│   ├── src/{contexts/userContext.tsx, hooks/useCollection|useToast, types/album|metadata|modale, functions/collectionFunctions}
│   └── public/logo.svg
├── landing/.astro/ (scaffold)
├── docker-compose.yml + .env(.example) + .env.test
└── CONTEXT.md | TODO.md | UPDATE.md | REVUE_CODE.md | INCOHERENCES.md
```

### 17.2 Références codebase (extraits vérifiés)
- `api/prisma/schema.prisma:15-141` modèles, `api/prisma/seed.ts:60-73` system user, `api/package.json:22-34` deps, `app/package.json:13-40` deps
- `api/server.js:22-29` CORS, `api/routers/index.js:14-38` rateLimit commenté, `api/middleware/upload.middleware.js:3-12` multer+sharp, `api/middleware/auth.middleware.js:5-25` jwt
- `api/controllers/album.controller.js:33-50` getAll, `api/controllers/collection.controller.js:98-108` sharp WebP, `api/controllers/user.controller.js:84-89` cookie, `api/controllers/user.controller.js:430-520` deleteAccount
- `app/src/App.tsx:19-42` routes, `app/vite.config.ts:10-44` PWA, `app/src/contexts/userContext.tsx:30-56` zod, `app/src/pages/MasterAlbum/index.tsx:1-308` actions, `app/src/pages/MyAlbumDetails/index.tsx:22-24` getImageUrl
- `docker-compose.yml:38-44` healthcheck, `TODO.md:21-23` livré 27/08, `REVUE_CODE.md:6` verdict 6.2/10

### 17.3 Glossaire
- **MasterAlbum** : `Album` catalogue mutualisé (`GET /albums/:id`) — garde title/artist même après anonymisation.
- **UserAlbum** : instance possédée (`UserAlbum` join) — prix/état/notes/photos par user.
- **system@va.eu** : `SYSTEM_USER_EMAIL` (`api/.env.example:8`) uuid fixe `a0000000-0000-4000-a000-000000000001`, `canConnect=false`.

---

> **Note lead dev** (`REVUE_CODE.md:114-117`) : freeze features, ship P0 en PR `fix/p0-prod-hardening` <300 lignes, puis `refactor/ts-service-layer` pour extraire `user.controller.js:461` lignes vers services. Exécuter `UPDATE.md` dans l'ordre P0→P1→P2.
