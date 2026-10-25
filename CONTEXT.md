# CONTEXT.md - Project: vinyls_addict

## English
This project is a web-based application designed for music enthusiasts to manage and track their vinyl record collections and wishlists.

### Tech Stack
- **Backend:** Node.js with Express.
  - ORM: Prisma (connected to a PostgreSQL database).
  - Authentication: JWT, bcryptjs, cookie-parser.
  - Security: helmet, express-rate-limit, CORS.
  - Language: JavaScript (ESM).
- **Frontend:** React with Vite.
  - Language: TypeScript.
  - Styling: Tailwind CSS, Sass.
  - State Management: React Context.
  - PWA: Progressive Web App capabilities via `vite-plugin-pwa`.
  - Routing: React Router.

### Core Functionality
The application allows users to:
1. **Manage Collections:** Users can add albums to their personal collection (`UserAlbum`), including details like condition, price, notes, and photos.
2. **Track Wishlist:** Users can add albums they want to acquire to a wishlist.
3. **Browse/Search:** The application supports browsing or searching for albums.
4. **User Management:** Secure user registration, authentication, and role-based access (USER, ADMIN).
5. **Metadata:** Comprehensive data modeling for albums, including format, genre, style, and vinyl variants.

### Database Structure (Key Models)
- `User`: Manages user authentication, profile, and roles.
- `Album`: The base model for all albums.
- `UserAlbum`: Join model connecting Users to Albums with specific collection information.
- `Wishlist`: Links users to desired albums.
- `Genre`, `Style`, `Format`, `Condition`, `VinylVariant`: Lookup/Configuration tables.

---

## Français
Ce projet est une application web conçue pour les passionnés de musique afin de gérer et de suivre leurs collections de vinyles et leurs listes de souhaits.

### Pile Technologique
- **Backend :** Node.js avec Express.
  - ORM : Prisma (connecté à une base de données PostgreSQL).
  - Authentification : JWT, bcryptjs, cookie-parser.
  - Sécurité : helmet, express-rate-limit, CORS.
  - Langage : JavaScript (ESM).
- **Frontend :** React avec Vite.
  - Langage : TypeScript.
  - Styling : Tailwind CSS, Sass.
  - Gestion d'état : React Context.
  - PWA : Capacités Progressive Web App via `vite-plugin-pwa`.
  - Routage : React Router.

### Fonctionnalités principales
L'application permet aux utilisateurs de :
1. **Gérer leurs collections :** Ajouter des albums à leur collection personnelle (`UserAlbum`), incluant des détails comme l'état, le prix, des notes et des photos.
2. **Suivre une liste de souhaits :** Ajouter des albums qu'ils souhaitent acquérir.
3. **Parcourir/Rechercher :** Rechercher et parcourir les albums.
4. **Gestion des utilisateurs :** Inscription, authentification et accès basé sur les rôles (USER, ADMIN).
5. **Métadonnées :** Modélisation complète des données pour les albums (format, genre, style, variantes).

### Structure de la base de données (Modèles clés)
- `User` : Gère l'authentification, le profil et les rôles.
- `Album` : Modèle de base pour tous les albums.
- `UserAlbum` : Modèle de jointure connectant les Utilisateurs aux Albums avec des informations spécifiques.
- `Wishlist` : Lie les utilisateurs aux albums souhaités.
- `Genre`, `Style`, `Format`, `Condition`, `VinylVariant` : Tables de configuration.
