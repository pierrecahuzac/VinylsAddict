# CADDY.md — Caddy comme reverse proxy / serveur de fichiers statiques

## Contexte

- La vidéo sur les performances du serveur proposait nginx pour servir les fichiers statiques (photos des vinyles) et router le reste vers l'API.
- L'objectif étant de mutualiser les apps (frontend, API, uploads), l'option **Caddy** est maintenant envisagée pour remplacer nginx.

## Solution proposée

- Caddy remplace nginx : `file_server` pour les fichiers statiques (`/uploads/`) et `reverse_proxy` pour l'API.

### Caddyfile (exemple)

```
:8080 {
	root * /srv
	file_server

	handle /uploads/* {
		file_server
		header Cache-Control "public, max-age=31536000"
	}
	handle {
		reverse_proxy localhost:33000
	}
}
```

### Ajout dans le docker-compose

```yaml
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./api/uploads:/srv/uploads:ro
    depends_on:
      - api
```

## nginx vs Caddy

| Critère | nginx | Caddy |
|---|---|---|
| Static files | `location` + `root`/`alias` | `handle` + `file_server` |
| Reverse proxy | `proxy_pass` | `reverse_proxy` |
| HTTPS | via certbot / manual | automatique (Let's Encrypt) |
| Multi-apps | blocs `server` | blocs de site |
| Simplicité de config | plus verbeuse | très concise |

## Verdict

- **Faisable techniquement** : oui, Caddy couvre les deux besoins (static + proxy).
- **Recommandation** : pour un setup multi-apps avec besoin d'uploads statiques et de HTTPS automatique, **Caddy est un excellent choix**, légèrement plus simple que nginx pour ce pattern.

---

*Document créé suite à la question : "nginx ou Caddy ?" pour la diffusion des photos et le reverse proxy.*
