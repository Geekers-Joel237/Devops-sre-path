🧠 Concepts Clés : Configuration & Secrets (Dev vs Prod)

Cette étape marque la transition entre "ça marche sur ma machine" et "ça marche pour de vrai".
Nous avons restructuré notre projet pour séparer clairement ce qui relève de l'architecture (immuable) de ce qui relève de l'environnement (variable).

## 1. Le Problème de la Configuration Unique
Vouloir utiliser le même `docker-compose.yml` pour le développement et la production est une erreur classique qui mène à :
- Des fichiers illisibles (trop de commentaires).
- Des risques de sécurité (ports DB ouverts en prod).
- Des performances dégradées (volumes montés en prod).

## 2. La Solution : L'Héritage de Configuration (Override)
Docker Compose permet de fusionner plusieurs fichiers. Nous avons adopté une stratégie à 3 niveaux :

### A. Le Socle Commun (`docker-compose.yml`)
C'est la "Vérité Terrain". Il décrit l'architecture logicielle.
- **Contenu :** Liste des services, noms des images/builds, réseaux internes, dépendances (`depends_on`).
- **Philosophie :** "Agnostique". Ce fichier ne sait pas s'il tourne en dev ou en prod.

### B. L'Environnement de Développement (`docker-compose.override.yml`)
C'est le fichier "Confort & Outillage". Il est chargé automatiquement par défaut.
- **Contenu :**
  - **Volumes de code :** Pour le Hot Reload (Vite) et l'édition PHP en direct.
  - **Ports exposés :** DB (5432) et Redis (6379) ouverts pour les outils GUI locaux.
  - **Commandes de dev :** `npm run dev` au lieu de Nginx.
- **Philosophie :** "Transparence & Rapidité". On veut voir et toucher le code.

### C. L'Environnement de Production (`docker-compose.prod.yml`)
C'est le fichier "Sécurité & Performance". Il doit être appelé explicitement.
- **Contenu :**
  - **Pas de volumes de code :** Le code est scellé dans l'image (Immuabilité).
  - **Isolation réseau :** DB et Redis fermés au monde extérieur.
  - **Optimisation :** Frontend servi en statique par Nginx (Multi-stage build).
  - **Secrets :** Injection explicite des variables sensibles.
- **Philosophie :** "Stabilité & Sécurité". Rien ne bouge, rien ne sort.

## 3. Points d'Attention & Pièges

### Le "Drift" (Dérive)
C'est le risque que la prod et le dev s'éloignent.
- **Risque :** Ajouter un service dans l'override de dev mais oublier de l'ajouter dans la base.
- **Solution :** Toujours modifier `docker-compose.yml` pour l'architecture. Ne jamais ajouter de *service* uniquement dans l'override (sauf outils de debug purs).

### La Gestion des Secrets
- En Dev : `.env` local monté via volume. Pratique mais non sécurisé.
- En Prod : Injection via variables d'environnement (`environment:` dans le yaml).
- **Règle d'or :** Ne jamais commiter de fichier `.env` contenant des vrais secrets.

### Le Build Frontend
- En Dev : Le conteneur est une "Usine" (Node.js) qui tourne en continu.
- En Prod : Le conteneur est un "Magasin" (Nginx) qui sert des fichiers morts.
- **Conséquence :** Le `Dockerfile` doit gérer ces deux états (Multi-stage build) et le `docker-compose` doit cibler le bon stage (`target: build` en dev).

## 4. Infrastructure as Code (IaC)
Cette structure prépare le terrain pour l'industrialisation :
- **Terraform** gère les machines (Hardware).
- **Ansible** gère la config OS et déploie ces fichiers Compose.
- **Docker Compose** gère l'architecture applicative.
C'est le pattern standard pour des déploiements robustes hors-Kubernetes.

Cependant, il y a un piège classique avec les SPA (Single Page Applications). Les variables d'environnement VITE_... sont injectées au moment du build (npm run build), pas au moment où le conteneur démarre. Comme notre Dockerfile fait le build (RUN npm run build) sans connaître les variables d'environnement du docker-compose.yml (car elles sont runtime), la variable VITE_API_URL risque d'être vide ou indéfinie dans l'image finale.
Pour corriger cela en production, il y a deux écoles :
1.
Build-time args : On passe l'URL de l'API comme un ARG dans le Dockerfile au moment du build. C'est propre mais ça oblige à rebuilder l'image si l'URL de l'API change.
2.
Runtime injection : On remplace une chaîne de caractères spéciale dans les fichiers JS au démarrage du conteneur Nginx. C'est complexe.
3.
Configuration externe : Le frontend charge un fichier config.js au démarrage qui contient l'URL.

Nous avons maintenant une architecture complète :
•
Dev : docker-compose up (Base + Override) -> Hot Reload, Outils de debug.
•
Prod : docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -> Optimisé, Sécurisé.


Les Bonnes Pratiques pour accéder aux données de Prod
Voici les méthodes recommandées, de la plus sécurisée à la plus "pratique" :
1.
Tunnel SSH (La méthode standard)
◦
Vous ne publiez aucun port de base de données ni pgAdmin.
◦
Vous vous connectez en SSH à votre serveur de production.
◦
Vous créez un tunnel : "Tout ce que j'envoie sur le port 5433 de mon PC, envoie-le au port 5432 du serveur (ou du conteneur Docker)".
◦
Vous utilisez votre client local (pgAdmin local, DBeaver, TablePlus) connecté à localhost:5433.
◦
Avantage : Sécurité maximale (chiffré, authentifié par clé SSH).
2.
VPN / Réseau Privé
◦
Votre serveur de base de données n'est accessible que depuis le réseau interne de l'entreprise (VPN).
◦
Vous devez être connecté au VPN pour accéder à pgAdmin (qui peut alors tourner sur un serveur interne).
3.
Bastion Host
◦
Un serveur intermédiaire ultra-sécurisé qui sert de porte d'entrée unique pour accéder aux ressources internes.


Comment gérer les fichiers .env ?
Vous avez deux façons de voir les choses :
1. La vision "Serveur" (La plus courante)
   Sur chaque machine physique (ou VM), vous avez un fichier nommé simplement .env à la racine du projet.
   •
   Sur le serveur Staging : Le fichier .env contient DB_HOST=staging-db, APP_ENV=staging.
   •
   Sur le serveur Prod : Le fichier .env contient DB_HOST=prod-db, APP_ENV=production.
   Quand vous lancez docker-compose sur le serveur, il lit automatiquement ce .env. C'est simple.
2. La vision "Local / Simulation" (Votre question)
   Si vous voulez gérer ou simuler ces environnements depuis votre machine (ou si vous utilisez un outil de déploiement qui pousse les fichiers), vous allez avoir plusieurs fichiers :
   •
   .env (Votre dev local)
   •
   .env.staging (Les secrets de staging)
   •
   .env.prod (Les secrets de prod)
   Et là, OUI, il est impératif qu'ils ne soient JAMAIS committés.

Résumé de la stratégie pour la suite
•
Dev : Utilise docker-compose.override.yml + .env (local).
•
Staging : Utilise docker-compose.prod.yml + .env.staging (sur le serveur, renommé en .env).
•
Prod : Utilise docker-compose.prod.yml + .env.prod (sur le serveur, renommé en .env).
C'est propre, sécurisé et scalable.

Pour tester la simulation :
Une fois créés, vous pourrez lancer la "Staging" avec :
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.staging up --build
