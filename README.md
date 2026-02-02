# Docker Path - Learning Journey

Ce dépôt contient le projet fil rouge du parcours d'apprentissage **DevOps & SRE Path**, focalisé sur la conteneurisation avec Docker et l'orchestration.

L'objectif est de partir d'une application classique (Laravel + React) et de la transformer étape par étape en une architecture Cloud-Native robuste, sécurisée et prête pour la production.

## 🗺️ La Progression (Branches)

Chaque étape majeure du projet a été réalisée sur une branche spécifique pour permettre de suivre l'évolution du code et de l'infrastructure.

### 🟢 PHASE 1 : Infrastructure Locale
*Apprendre à utiliser Docker pour remplacer WAMP/XAMPP.*
- **Branche :** `phase1/step1-local-infra`
- **Contenu :** Mise en place de PostgreSQL et Redis via Docker Compose. Connexion de l'application locale à ces services.

### 🟡 PHASE 2 : Conteneurisation Applicative
*Créer nos propres images Docker pour l'application.*
- **Branche :** `phase2/step2-backend` : Création du `Dockerfile` pour l'API Laravel (PHP-FPM).
- **Branche :** `phase2/step2.5-frontend` : Création du `Dockerfile` pour le Frontend React (Multi-stage build : Node.js -> Nginx).

### 🟠 PHASE 3 : Orchestration Complète
*Faire tourner toute la stack ensemble.*
- **Branche :** `phase3/step3-orchestration` : `docker-compose.yml` complet reliant API, Frontend, DB et Redis.
- **Branche :** `phase3/step3.5-config-secrets` : Séparation des environnements Dev/Prod (Override files), gestion des secrets, et pattern Gateway (Nginx).

### 🔴 PHASE 4 : Production Grade (À venir)
*Observabilité et Résilience.*
- **Branche :** `phase4/observability` : Mise en place de logs centralisés et monitoring.

## 🏗️ L'Application Fil Rouge

Il s'agit d'une **Todo App** simple mais architecturée comme une vraie application moderne :
- **Backend :** Laravel 11 (API REST)
- **Frontend :** React 19 + Vite + Tailwind CSS
- **Database :** PostgreSQL 17
- **Cache :** Redis

## 🚀 Comment utiliser ce dépôt ?

1.  **Cloner le projet**
    ```bash
    git clone <votre-repo>
    cd docker-path
    ```

2.  **Naviguer entre les étapes**
    Pour voir le code à une étape précise :
    ```bash
    git checkout phase3/step3.5-config-secrets
    ```

3.  **Suivre le guide**
    Consultez le fichier `progression.md` à la racine pour voir le détail des objectifs pédagogiques et des concepts abordés.
