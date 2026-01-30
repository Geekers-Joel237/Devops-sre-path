🚀 STEP 2.5 — Containeriser le Frontend (React)
C'est le dernier morceau du puzzle pour avoir une stack complète.
Le défi conceptuel : Contrairement à PHP qui a besoin d'un moteur pour s'exécuter à chaque requête, une application React (une fois buildée) n'est qu'un tas de fichiers .html, .js et .css.
Nous avons donc deux modes de fonctionnement très différents :
1.
Mode Développement (Dev) :
◦
On utilise un serveur Node.js (vite dev server).
◦
Il fait du Hot Module Replacement (HMR) : on change une couleur, le navigateur se met à jour sans recharger.
◦
C'est ce que vous faites avec npm run dev.
2.
Mode Production (Prod) :
◦
On "compile" le projet (npm run build).
◦
Cela génère un dossier dist/ avec des fichiers optimisés.
◦
On sert ces fichiers avec un serveur web ultra-rapide (Nginx) sans Node.js.
Notre objectif ici : Comme pour le backend, nous allons configurer un environnement Docker qui supporte le Mode Développement (pour l'instant), mais avec un Dockerfile prêt pour la production (Multi-stage build).


1. Le Concept : "L'Usine" vs "Le Magasin"
   Pour comprendre comment dockeriser du React proprement, il faut visualiser deux lieux distincts :
   •
   L'Usine (Node.js) : C'est un environnement sale, bruyant, rempli d'outils lourds (Node, NPM, des milliers de fichiers dans node_modules). C'est là qu'on fabrique l'application.
   •
   Le Magasin (Nginx) : C'est un environnement propre, minimaliste, optimisé pour servir le client rapidement. Il ne contient que le produit fini (HTML, CSS, JS minifié).
2. La Solution Technique : Multi-Stage Build
   Docker nous permet de définir ces deux lieux dans un seul fichier Dockerfile. C'est ce qu'on appelle le "Multi-stage build".
   Le fichier va ressembler à ça (conceptuellement) :

# --- Étape 1 : L'Usine (Builder) ---
FROM node:18-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
# À la fin de cette étape, on a un dossier /app/dist qui contient le site prêt.

# --- Étape 2 : Le Magasin (Production) ---
FROM nginx:alpine
# On copie UNIQUEMENT le dossier dist de l'étape 1
COPY --from=build /app/dist /usr/share/nginx/html
# On jette tout le reste (Node, NPM, node_modules...).

3. Le Cas Particulier du Développement (Local)
   C'est là que ça se complique pour nous aujourd'hui. Le Dockerfile ci-dessus est parfait pour la Prod. Mais en Dev, on ne veut pas "builder" et servir avec Nginx. On veut le "Hot Reload" (HMR).
   Pour le développement local, nous allons utiliser une astuce dans docker-compose.yml :
1.
On va dire à Docker de construire l'image en s'arrêtant à l'étape "Usine" (Node).
2.
On va écraser la commande par défaut pour lancer npm run dev.
3.
On va monter un volume pour que vos modifications de code soient vues par le conteneur.
Résumé du plan d'action
1.
Créer le Dockerfile (Multi-stage) dans frontend/ : Il sera "Production Ready" par défaut.
2.
Modifier docker-compose.yml : Ajouter le service frontend, mais le configurer spécifiquement pour le mode "Dev" (Port 5173, Volume, Commande dev).
