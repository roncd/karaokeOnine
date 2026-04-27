# TEST
# ─── Stage 1 : Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances en premier (cache Docker optimisé)
COPY package*.json ./

# Installation des dépendances
RUN npm ci --frozen-lockfile

# Copie du reste du code source
COPY . .

# Build de production
RUN npm run build

# ─── Stage 2 : Serve ───────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Copie du build React vers le dossier servi par nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Configuration nginx pour le routing React (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Lancement de nginx
CMD ["nginx", "-g", "daemon off;"]
