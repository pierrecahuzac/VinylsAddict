# CACHING.md — Cache applicatif avec Redis

## Objectif

Documenter la solution proposée lors de l'analyse des performances du serveur : ajouter Redis entre l'application et la base de données pour mettre en cache les données fréquemment consultées (ex : page d'accueil).

## Contexte

- La vidéo sur l'optimisation des performances du serveur propose une évolution : diffusion statique via nginx (voir `PERFORMANCE.md`) + cache applicatif via Redis.
- L'API (Express + Prisma) accède actuellement en direct à PostgreSQL à chaque requête.

## Solution proposée

- Ajouter un serveur Redis (`redis:7-alpine`) dans la stack.
- Insérer un layer de cache entre l'API et la base : les lectures fréquentes (ex : page d'accueil) sont servies depuis Redis, les écritures (création / mise à jour) invalident les clés concernées.

### Ajout dans le docker-compose

```yaml
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
```

### Exemple d'utilisation côté API (couche cache)

- Clé de cache : ex `homepage:featured`
- TTL : ex 300 secondes
- Logique type : `cache.get(key)` → si hit, retour du cache ; sinon requête Prisma → `cache.set(key, value, ttl)`

## Cas d'usage : page d'accueil

- Données concernées : celles affichées à l'accueil (ex : albums mis en avant, statistiques, métadonnées).
- Stratégie : cache de lecture avec invalidation ciblée sur les écritures.

## Analyse de viabilité

- **Faisable** : oui (`ioredis` ou `node-redis` côté Node).
- **Points de vigilance** :
  - Invalidation des clés lors des écritures (create/update/delete).
  - Gestion de la concurrence (protection contre la "cache stampede").
  - Fallback automatique sur la base en cas d'erreur Redis.
  - Monitoring du taux de hit.

## Verdict

- **Viable et recommandée** pour ce type de données (lues souvent, rarement modifiées).
- À combiner avec la solution nginx décrite dans `PERFORMANCE.md` pour une optimisation complète.

---

*Document créé suite à la question sur l'ajout de Redis pour le cache applicatif.*
