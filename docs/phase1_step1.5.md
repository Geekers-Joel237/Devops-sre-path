Nous allons aborder 3 concepts clés :
1.
Restart Policies : Que fait Docker quand un conteneur meurt ? (Nous l'avons déjà effleuré avec restart: unless-stopped).
2.
Healthchecks : Comment Docker sait-il que la DB est vraiment prête à recevoir des requêtes (et pas juste "démarrée") ?
3.
Ordre de démarrage (Depends On) : Comment s'assurer que l'API ne démarre pas avant la DB ?
Concept 1 : Le problème du "Démarrage vs Prêt"
Quand vous lancez docker-compose up, Docker démarre le conteneur Postgres. Il passe au statut "Up" presque instantanément. MAIS, à l'intérieur, Postgres est en train d'initialiser ses fichiers, charger la config... Il n'est pas encore prêt à accepter une connexion sur le port 5432.
Si votre API Laravel démarre en même temps et essaie de se connecter immédiatement : CRASH. Connection refused.
La solution naïve : Ajouter un sleep 10 dans le script de démarrage de l'API. (Moche et lent). La solution Docker : Les Healthchecks.

Concept 2 : Healthchecks
Un Healthcheck est une petite commande que Docker exécute régulièrement dans le conteneur pour lui demander : "Tu vas bien ?".
Pour Postgres, la commande est souvent pg_isready.
services:
postgres:
# ...
healthcheck:
test: ["CMD-SHELL", "pg_isready -U postgres"]
interval: 10s
timeout: 5s
retries: 5

Concept 3 : Dépendances conditionnelles
Une fois que Postgres a un moyen de dire "Je suis prêt" (healthy), on peut dire aux autres services (comme l'API plus tard, ou un outil de migration) :
"Attends que Postgres soit Healthy avant de démarrer."

api:
depends_on:
postgres:
condition: service_healthy