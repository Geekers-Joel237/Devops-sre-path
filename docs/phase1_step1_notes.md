🧠 Concepts Clés & Points de Vigilance
Pour cette étape, nous devons maîtriser trois concepts fondamentaux :
1. L'Éphémère vs La Persistance (Le piège n°1)
   Un conteneur est conçu pour être jetable. Si vous arrêtez et supprimez un conteneur MySQL, tout ce qui est à l'intérieur est détruit.
   •
   Le risque : Perdre toutes vos données à chaque redémarrage.
   •
   La solution : Les Volumes. On va dire à Docker : "Stocke les fichiers de la base de données (habituellement /var/lib/mysql) NON PAS dans le conteneur, mais dans un espace protégé sur ma machine hôte."
2. Le "Port Mapping" (Le pont vers l'extérieur)
   Le conteneur est comme une mini-machine isolée. Par défaut, personne ne peut y accéder.
   •
   MySQL dans le conteneur écoute sur le port 3306.
   •
   Votre API Laravel sur votre machine cherche le port 3306.
   •
   Le mécanisme : On doit créer un pont (mapping). On dit à Docker : "Quand je tape sur le port 3306 de mon Windows, transfère la requête au port 3306 du conteneur MySQL."
3. L'Isolation Réseau
   Par défaut, les conteneurs ne voient pas votre machine hôte de la même manière que vous.
   •
   Pour l'instant (Phase 1), comme l'API tourne sur l'hôte (Windows) et la DB dans Docker, on communiquera via localhost (grâce au Port Mapping).
   •
   Plus tard (Phase 3), quand l'API sera aussi dans Docker, localhost ne fonctionnera plus. C'est une distinction cruciale à anticiper.
Conclusion :
   Pour la Phase 1, nous allons utiliser Docker Compose. C'est un outil qui permet de décrire ces services dans un fichier YAML simple (docker-compose.yml) plutôt que de taper des commandes docker run à rallonge.

**Docker run VS Docker compose**
   • docker run -d \
            --name todo-mysql \
            -p 3306:3306 \
            -e MYSQL_ROOT_PASSWORD=root \
            -e MYSQL_DATABASE=todo_app \
            -e MYSQL_USER=app_user \
            -e MYSQL_PASSWORD=password \
            -v mysql-data:/var/lib/mysql \
            mysql:8.0
Décortiquons chaque ligne (les concepts) :
•
docker run: "Crée et démarre un conteneur".
•
-d (Detached): "Lance-le en arrière-plan, rends-moi la main dans le terminal".
•
--name todo-mysql: "Donne-lui un petit nom facile à retenir pour que je puisse l'arrêter (docker stop todo-mysql) sans chercher son ID bizarre".
•
-p 3306:3306: Le Port Mapping. "Branche le port 3306 de mon PC (gauche) sur le port 3306 du conteneur (droite)".
•
-e ...: Variables d'environnement. C'est ici qu'on configure l'intérieur du conteneur au démarrage (création de la DB, users, etc.).
•
-v mysql-data:/var/lib/mysql: Le Volume. "Crée un volume nommé mysql-data (géré par Docker) et monte-le dans le dossier /var/lib/mysql du conteneur (là où MySQL stocke ses fichiers)".
•
mysql:8.0: L'Image. "Utilise la version 8.0 officielle de MySQL".


docker run -d \
--name todo-redis \
-p 6379:6379 \
-v redis-data:/data \
redis:alpine

Les différences/points clés :
•
redis:alpine: On utilise souvent les versions alpine car elles sont minuscules (quelques Mo) comparées aux images standard.
•
-v redis-data:/data: Redis stocke ses snapshots de persistance dans /data. Même si c'est du cache, c'est utile de ne pas le vider si on redémarre juste le conteneur.


Pourquoi on préfère Docker Compose ?
Si vous utilisez docker run, vous avez plusieurs problèmes à gérer manuellement :
1.
Le Réseau : Par défaut, ces deux conteneurs ne se "voient" pas facilement entre eux (sauf via l'IP de votre machine). Avec Compose, un réseau virtuel est créé automatiquement pour qu'ils puissent se parler (utile plus tard).
2.
La Maintenance : Vous devez vous souvenir de ces commandes à rallonge. Si vous voulez changer le mot de passe, vous devez tuer le conteneur et retaper toute la commande.
3.
L'Orchestration : Démarrer les deux en même temps demande deux commandes.
docker-compose.yml est simplement la version écrite et versionnée de ces commandes docker run.

- Structure docker-compose.yml file :
  - La structure de base se divise en 3 blocs principaux :
1.
version (Obsolète mais souvent vu)
2.
services (Le cœur : les conteneurs)
3.
volumes (Le stockage)
4.
networks (La communication - on verra ça plus tard)