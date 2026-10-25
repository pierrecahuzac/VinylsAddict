# Stage 1: build Astro static site
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
# pas de package-lock.json -> npm install (compatible npm ci si lock présent)
RUN npm install
COPY . .
ARG PUBLIC_APP_URL=https://app.vinyls-addict.eu
ENV PUBLIC_APP_URL=$PUBLIC_APP_URL
RUN npm run build

# Stage 2: serve avec nginx (léger, permanent)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# config nginx SPA: fallback propre (Astro static = pas nécessaire mais safe)
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n  # cache assets\n  location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {\n    expires 30d;\n    add_header Cache-Control "public, immutable";\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
