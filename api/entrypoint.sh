#!/bin/sh

set -e # Arrête immédiatement si n'importe quelle commande échoue (exit code != 0)

echo "==============================================="
echo "🚀 Démarrage du service API : Exécution des migrations et seeds."
echo "==============================================="

# 1. Migrations de la base de données
npx prisma migrate deploy

# 2. Initialisation/Seed de la base de données
npx prisma db seed

echo "✅ Bases de données migrées et seedées avec succès."

# 3. Lancement du serveur en mode développement (nodemon)
# Les arguments passés au container seront transmis à nodemon (ex: --watch ou autres flags)
exec pnpm run nodemon "$@"