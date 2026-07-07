# Suivi des incohérences et dette technique - VinylsAddict

Ce document sert à suivre les points d'amélioration, les incohérences structurelles et la dette technique identifiés dans le projet pour assurer un suivi évolutif.

## État des lieux

| ID | Catégorie | Description | Priorité | Statut |
|:---|:---|:---|:---|:---|
| 001 | Configuration | Le fichier `.env.example` à la racine est mal formaté (variables fusionnées). | Basse | Résolu |
| 002 | Typescript | Incohérence entre les types `Metadata` (ID en `number`) et la réalité de l'API (ID en `string`/UUID). | Haute | Résolu |
| 003 | Maintenance | Présence de `console.log` de debug dans les contrôleurs (`api/controllers/user.controller.js`). | Basse | Résolu |
| 004 | Organisation | Les fichiers de tests sont mélangés avec le code source (`api/controllers/user.controller.test.js`). | Basse | Résolu |
| 005 | Architecture | Risque CORS en production : logique fragile dans `api/server.js`. | Haute | Résolu |
| 006 | Intégrité | Absence de contrainte `@unique` composite sur Album (title, artist, userId). | Haute | Non applicable (MVP) |

---

## Instructions pour la mise à jour
- Lorsqu'une incohérence est résolue, change le statut de "Ouvert" à "Résolu".
- Ajoute de nouvelles entrées au fur et à mesure que tu en identifies lors du développement.
- Priorise les corrections de types (ID, interfaces) pour éviter les bugs futurs.
