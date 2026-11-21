# Configuration de la réinitialisation de mot de passe (Infomaniak + Cloudflare + VPS)

Ce guide décrit la mise en place complète du parcours « Mot de passe oublié » de Vinyls Addict :

1. l'utilisateur saisit son email sur `/forgot-password` ;
2. l'API génère un token aléatoire, en stocke **le hash SHA-256** en BDD (`PasswordResetToken`), valable **1 heure**, et envoie un lien par email via **SMTP Infomaniak** ;
3. l'utilisateur suit le lien `/reset-password?token=...`, choisit un nouveau mot de passe, l'API le hache avec bcrypt puis invalide les tokens du compte.

La réponse de `POST /api/users/forgot-password` est **toujours identique**, que le compte existe ou non, afin de ne pas révéler l'existence des comptes.

---

## 1. Infomaniak — créer un « mot de passe d'appareil »

Le mot de passe du Manager **ne fonctionne pas** pour SMTP : il faut un mot de passe dédié.

1. Connecte-toi à <https://manager.infomaniak.com/>.
2. **Service Mail** → clique sur le domaine (`partagetacollection.eu`) → sur l'adresse d'envoi (ex. `admin@partagetacollection.eu`).
3. Onglet **Appareils** → **Ajouter un appareil**.
4. Laisse « aucun utilisateur », donne un nom explicite (ex. `SMTP Vinyls Addict`), puis **génère le mot de passe**.
5. **Copie-le immédiatement** : il n'est affiché qu'une seule fois.
6. Clique sur **Enregistrer / Save** en bas de la page (un email de confirmation est envoyé).

> Pour un compte *my kSuite* (`@ik.me`, `@ikmail.com`) : <https://ksuite.infomaniak.com/mail> → menu **⋮** à droite de l'adresse → **Paramètres** → **Gérer le mot de passe** → **Ajouter un appareil** → onglet **IMAP / SMTP**.

Paramètres SMTP Infomaniak :

| Paramètre | Valeur |
|---|---|
| Serveur SMTP | `mail.infomaniak.com` |
| Port | `587` (STARTTLS) ou `465` (SSL implicite) |
| Identifiant | **l'adresse email complète** |
| Mot de passe | le mot de passe d'appareil généré à l'étape 4 |

---

## 2. Cloudflare — publier les enregistrements DNS

Le domaine utilise Cloudflare comme DNS : c'est donc **là** que les enregistrements mail doivent être ajoutés, pas chez Infomaniak.

Dans **Cloudflare → DNS → partagetacollection.eu**, ajoute :

| Type | Name | Valeur | Priorité |
|---|---|---|---|
| `MX` | `@` | `mta-gw.infomaniak.ch` | `5` |
| `TXT` | `@` | `v=spf1 include:spf.infomaniak.ch -all` | — |
| `TXT` | `<selecteur>._domainkey` | `v=DKIM1; k=rsa; p=<cle_publique>` | — |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@partagetacollection.eu` | — |

Le **sélecteur DKIM** et la **clé publique** se trouvent dans le Manager Infomaniak → Service Mail → **Global Security** → section DKIM.

⚠️ Points importants :

- Tous ces enregistrements doivent être en **« DNS only »** (nuage grisé), jamais proxy orange.
- S'il existe déjà un **TXT `v=spf1`**, ne pas en créer un second : fusionne les `include:` dans le même enregistrement avant `-all`.
- Supprime tout enregistrement **NS** existant pour `_domainkey` pointant vers Infomaniak.
- Désactive **Cloudflare Email Routing** si activé (conflit avec le MX).
- Selon l'interface Cloudflare, le champ « Name » d'un DKIM accepte soit `<selecteur>` (Cloudflare ajoute `._domainkey`), soit directement `<selecteur>._domainkey`. Vérifie avec la commande `nslookup` ci-dessous.
- La propagation peut prendre jusqu'à 48 h (souvent quelques minutes).

---

## 3. Infomaniak — activer la signature DKIM

Publier la clé ne suffit pas : il faut aussi **activer la signature** dans Infomaniak.

1. Manager → Service Mail → ton service → **Global Security**.
2. Section **DKIM** → **Modifier / Créer** → **Activer le DKIM** → **Enregistrer**.
3. Rafraîchis le diagnostic : **SPF, DKIM et DMARC doivent être au vert**.

Un DKIM « publié mais non actif » produit des mails non signés et un rejet Gmail `550 5.7.26`.

---

## 4. VPS — variables d'environnement

Dans `/srv/vinyls_addict/.env` sur le VPS (ne jamais committer ce fichier) :

```env
FRONTEND_URL=https://app.partagetacollection.eu

SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=admin@partagetacollection.eu
SMTP_PASS='mot-de-passe-d-appareil'
SMTP_FROM=admin@partagetacollection.eu
```

- `SMTP_USER` = identifiant SMTP (adresse complète).
- `SMTP_FROM` = expéditeur visible. Les deux peuvent être identiques. `SMTP_FROM` doit correspondre à une adresse existante (boîte ou alias) du domaine.
- Mets le mot de passe **entre guillemets simples** : ça évite les problèmes avec `#`, `$`, `&`, etc. Aucun autre encodage n'est nécessaire.
- Sans `SMTP_HOST`, l'API affiche simplement le lien de reset dans ses logs (pratique en développement).

---

## 5. Redémarrage (étape critique)

Docker Compose **ne recrée pas** le conteneur quand le *contenu* du `.env` change. Un `docker compose restart` ou un simple `up -d` conserve les anciennes valeurs.

```bash
cd /srv/vinyls_addict
docker compose up -d --force-recreate api
docker logs --tail 50 api
```

---

## 6. Vérifications

### DNS (depuis n'importe quelle machine)

```bash
nslookup -type=MX partagetacollection.eu
nslookup -type=TXT partagetacollection.eu
nslookup -type=TXT _dmarc.partagetacollection.eu
nslookup -type=TXT <selecteur>._domainkey.partagetacollection.eu
```

### Connexion SMTP (sans afficher le secret)

```bash
docker exec api node -e 'import("nodemailer").then(async ({default:n})=>{const t=n.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_PORT==="465",auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});try{await t.verify();console.log("SMTP OK")}catch(e){console.log("SMTP FAIL",e.code,e.message)}})'
```

### Envoi réel

```bash
curl -s -X POST https://api.partagetacollection.eu/api/users/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"utilisateur@example.com"}'
```

La réponse doit être :

```json
{"message":"Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé."}
```

Puis vérifier :

- les logs API (`docker logs api`) : aucune ligne `[password-reset] échec envoi email` ;
- le **journal des emails sortants** Infomaniak : le message doit être « Délivré » ;
- la boîte Gmail du destinataire, y compris **Indésirables**.

---

## 7. Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `535 5.7.0 Invalid login or password` (`EAUTH`) | Mot de passe d'appareil oublié/non enregistré, ou `SMTP_USER` incorrect | Régénérer le mot de passe d'appareil, cliquer sur Enregistrer, utiliser l'adresse complète, puis `--force-recreate api` |
| `550 5.7.26 Unauthenticated email` (Gmail) | DKIM non activé chez Infomaniak ou DNS non propagé | Activer DKIM dans Global Security, attendre la propagation |
| Réponse 200 mais aucun mail | Rejet silencieux ou filtre Gmail | Journal des emails sortants Infomaniak + dossier Indésirables |
| Modification du `.env` sans effet | Conteneur non recréé | `docker compose up -d --force-recreate api` |
| Mail en indésirables chez Gmail | SPF/DKIM/DMARC pas encore tous verts | Vérifier les 4 enregistrements DNS et Global Security |

---

## 8. Sécurité

- Les tokens sont stockés **hashés** (SHA-256), pas en clair.
- Durée de vie : **1 heure**, usage unique (tous les tokens du compte sont invalidés après réinitialisation).
- L'API ne révèle pas si un email est inscrit.
- Aucun secret n'est versionné : seul `.env.example` contient des noms de variables vides.
- Une fois les mails délivrés sans problème, passer progressivement le DMARC de `p=none` à `p=quarantine`, puis `p=reject`.

### Procédure de secours (administrateur uniquement)

Si la messagerie est indisponible, un lien peut être créé directement en base. À utiliser uniquement pour le compte concerné, avec l'accord de son propriétaire :

```bash
TOKEN=$(openssl rand -hex 32)
HASH=$(printf '%s' "$TOKEN" | sha256sum | cut -d' ' -f1)
# Insérer HASH dans PasswordResetToken pour le userId cible, expiresAt = now()+1h
echo "https://app.partagetacollection.eu/reset-password?token=$TOKEN"
```

Le token affiché est à usage unique et expire après 1 heure, exactement comme un token envoyé par email.
