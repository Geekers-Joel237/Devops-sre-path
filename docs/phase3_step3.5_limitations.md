# Limitations & Dette Technique (Fin de Phase 3.5)

À la fin de la phase de configuration (Step 3.5), nous avons une architecture robuste mais qui présente encore quelques "rugosités" manuelles ou conceptuelles. Ce document liste ces points pour mémoire et amélioration future.

## 1. L'Initialisation Manuelle (Le "Day 1" Problem)
**Le Problème :**
Actuellement, après un `docker-compose up`, l'application ne fonctionne pas immédiatement. Il faut lancer manuellement :
- `composer install` (si le volume vendor est vide)
- `php artisan key:generate`
- `php artisan migrate`

**Pourquoi c'est une limitation ?**
Dans un environnement automatisé (CI/CD) ou lors de l'autoscaling, on ne peut pas avoir d'intervention humaine. Le conteneur doit être autonome ("Self-contained").

**Piste d'amélioration (Phase 4/5) :**
Utiliser un script d'`ENTRYPOINT` personnalisé dans l'image Docker qui détecte si l'app est installée et lance les commandes nécessaires au démarrage.

## 2. La Gestion des Permissions (Le "Volume" Problem)
**Le Problème :**
En développement, le volume monté (`./api:/var/www/html`) écrase les permissions définies dans le Dockerfile (`chown -R www-data...`).
Sur Linux/macOS, cela provoque souvent des erreurs "Permission denied" sur `storage/logs` car l'utilisateur hôte (UID 1000) n'est pas l'utilisateur conteneur (UID 33).

**Pourquoi c'est une limitation ?**
Cela rend l'expérience développeur (DX) fragile et dépendante de l'OS hôte.

**Piste d'amélioration (Phase 6) :**
Passer des arguments `UID/GID` au build ou utiliser des images de base gérant le "user mapping" (comme les images `linuxserver.io` ou via des scripts d'entrypoint malins).

## 3. Le HTTPS Manquant
**Le Problème :**
Toute la stack communique en HTTP clair (port 80).
En production, c'est inacceptable pour la sécurité (mots de passe, cookies de session).

**Pourquoi c'est une limitation ?**
Les navigateurs modernes bloquent certaines fonctionnalités (Service Workers, Géolocalisation) sans HTTPS.

**Piste d'amélioration (Phase 5) :**
Ajouter un Reverse Proxy global (Traefik ou Caddy) devant le frontend qui gère automatiquement les certificats Let's Encrypt.

## 4. La Gestion des Secrets "Statique"
**Le Problème :**
Les secrets de production sont injectés via un fichier `.env.prod` sur le serveur.
Si ce fichier est compromis, tout est compromis. Il est aussi difficile à auditer (qui a changé quoi ?).

**Pourquoi c'est une limitation ?**
Dans une grande équipe, on veut de la rotation de clés et de l'audit.

**Piste d'amélioration (Phase 6) :**
Utiliser un gestionnaire de secrets (Vault, AWS Secrets Manager) et injecter les secrets au runtime via l'orchestrateur.
