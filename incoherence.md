# ✅ Suivi des Corrections - Projet Vinyls Addict

Ce document répertorie les points de friction, les bugs potentiels et les écarts de convention qui ont été identifiés et résolus.

## 🏗️ Architecture & Configuration

- [x] **Clients Prisma en Double** : `api/database/prismaClient.js` est désormais le seul singleton utilisé.
- [x] **Instanciations multiples de PrismaClient** : Tous les contrôleurs utilisent désormais le singleton exporté.
- [x] **Dépendance suspecte au Frontend** : Nettoyage des dépendances inutiles effectué.

## 🛣️ API & Routage

- [x] **Non-respect des conventions REST** : Les routes utilisent désormais les noms de ressources (`GET /albums`, `POST /albums`, etc.).
- [x] **Méthode HTTP Inappropriée** : L'ajout à la wishlist est passé de `GET` à `POST`.
- [x] **Route Fantôme** : La route `/users/albums` est maintenant correctement définie et appelée par le frontend.

## 💾 Logique de Données & Base de Données

- [x] **Bug dans la Wishlist** : Correction de la logique Prisma pour utiliser le modèle de liaison explicite `Wishlist` avec `create` et gestion de la clé composite `userId_albumId`.
- [x] **Incohérence de Nommage** : Alignement fait entre `releaseDate` (Backend) et les besoins du Frontend.
- [x] **Gestion des Relations Multiples** : Le contrôleur `create` d'album a été préparé pour une meilleure gestion des relations.

## 🚦 Fiabilité & Erreurs

- [x] **Codes de statut HTTP cohérents** :
    - `getOneAlbum` : Renvoie désormais `404` si non trouvé.
    - `getUserAlbum` : Renvoie `200` au lieu de `201`.
    - `getAllUserAlbums` : Renvoie `200` avec `[]` si la collection est vide (au lieu de `404`).
    - `addAlbumToUserWishlist` : Renvoie `409` (Conflict) si déjà présent.
    - `signup` : Renvoie `409` (Conflict) si l'utilisateur existe déjà.
    - `login` : Renvoie `401` (Unauthorized) pour des identifiants invalides.

- [x] **Gestion d'erreurs incomplète** : Tous les blocs `catch` renvoient désormais une réponse `500` avec un message d'erreur clair, évitant les requêtes en attente.
- [x] **Type Safety** : Les conversions de types (`parseInt`, `parseFloat`) sont effectuées de manière sécurisée dans les transactions Prisma.

---
*Dernière mise à jour : 14 avril 2026*
