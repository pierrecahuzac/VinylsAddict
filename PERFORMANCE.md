# PERFORMANCE.md — Diffusion des photos des vinyles (nginx)

## Objectif

Documenter la solution proposée pour améliorer les performances du serveur lors de la diffusion des photos de vinyles, et évaluer sa faisabilité.

## Contexte

- Les photos des vinyles sont des fichiers uploadés par les utilisateurs (Multer + Sharp → WebP, `api/uploads/<uuid>.webp`).
- L'URL (`/uploads/<uuid>.webp`) est stockée en base (`CollectionImage`) et servie par le backend via les fichiers statiques :

```js
// api/server.js
app.use('/uploads', express.static('uploads'));
```

- Le frontend construit l'URL complète via `getImageUrl` (`app/src/pages/MyAlbumDetails/index.tsx`) en préfixant le backend (`VITE_BACKEND_URL_DEV`).

Résultat actuel : **chaque requête d'image passe par le process Node / Express** (middleware → `send` → accès au filesystem). Le serveur Node gère donc en plus des fichiers statiques les routes JSON de l'API.

## Solution proposée : nginx en reverse proxy / serveur de fichiers statiques

Le principe : placer nginx devant l'API.

- nginx sert les fichiers `/uploads/` **directement depuis le filesystem** (réécriture via `alias`/`root`).
- nginx **proxy passe** `/api/` vers Express (`http://api:33000`).
- **Alternative** : Caddy peut remplacer nginx pour ce pattern (voir `CADDY.md`).

Avantages :

- Envoi de fichiers via `sendfile` (I/O kernel → utilisateur) : beaucoup plus rapide que le transfert via Node.
- Déport CPU/IO du process Node : les workers Node restent focalisés sur l'API JSON.
- Cache navigateur natif (`expires` + `Cache-Control public`) : les photos (nommées en UUID = immuables) peuvent être mises en cache longtemps.
- Les requêtes `/uploads/` ne passent plus par le rate limiter Express global (`100 req / 15 min` en production) : les images ne consomment plus ce quota API.

### Exemple de configuration nginx

```nginx
server {
  listen 80;
  server_name _;

  location /uploads/ {
    alias /api/uploads/;
    expires 30d;
    add_header Cache-Control "public";
  }

  location /api/ {
    proxy_pass http://api:33000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    proxy_pass http://app:55173;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Exemple d'ajout au docker-compose

```yaml
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./api/uploads:/api/uploads:ro
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api
```

## Analyse de viabilité

### Points positifs

- **Faisable techniquement** : le pattern est simple (reverse proxy statique) et déjà utilisé en interne pour la landing (`nginx:alpine` + config custom dans `landing/Dockerfile`).
- **Gains réels** : transfert kernel-level (`sendfile`), cache navigateur, moins de charge CPU sur Node.
- **Inchangé côté logique applicative** : les URLs `/uploads/...` restent les mêmes, aucune migration DB ni frontend nécessaire.

### Points de vigilance

- **Authentification** : les fichiers statiques sont aujourd'hui publics (`express.static` sans auth). La solution nginx doit conserver ce comportement. Si les photos deviennent privées plus tard, il faudra passer par des URLs signées + vérification côté nginx.
- **Développement** : nginx n'est pas nécessaire en local ; `express.static` + proxy Vite (`/api`) suffisent.
- **Hébergement** : sur Render, le filesystem est éphémère — indépendant de la solution nginx.
- **Sécurité headers** : passer par nginx implique de configurer `proxy_set_header` (Host, X-Forwarded-*); `trust proxy` déjà positionné côté Express.

## Verdict

**Solution viable et recommandée** pour la diffusion des photos des vinyles via nginx :

- Oui, comme solution de performance : elle déporte le serving statique vers un serveur léger dédié, avec cache navigateur.
- Pour l'instant du projet, la charge est probablement faible ; cette solution est surtout pertinente avant d'atteindre un trafic important (grilles, lightbox, plusieurs utilisateurs connectés en simultané).

## Pour aller plus loin

- Ajouter un CDN (Cloudflare, etc.) pour la diffusion de bout en bout.
- Envisager un job de cleanup des fichiers orphelins côté API.

---

*Document créé suite à la question sur l'utilisation des performances du serveur via nginx pour la diffusion des photos des vinyles.*
