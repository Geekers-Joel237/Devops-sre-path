# --- Stage 1 : Build (L'Usine) ---
FROM node:20.19-alpine as build

WORKDIR /app

# On copie d'abord les fichiers de dépendances pour profiter du cache Docker
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste du code source
COPY . .

# Construction de l'application pour la production
RUN npm run build

# --- Stage 2 : Production (Le Magasin) ---
FROM nginx:alpine

# Copie des fichiers buildés depuis le stage précédent
COPY --from=build /app/dist /usr/share/nginx/html

# Copie d'une config Nginx personnalisée (optionnel mais recommandé pour React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]
