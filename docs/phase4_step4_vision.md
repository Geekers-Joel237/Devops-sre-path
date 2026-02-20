# Vision & Stratégie : Phase 4 - Observabilité Fondamentale

À ce stade, notre application tourne. Mais elle tourne dans une "boîte noire". Si elle ralentit ou tombe en panne, nous sommes aveugles. L'objectif de cette phase est de construire les premiers "sens" de notre système : la vue (les logs).

## 1. Le "Pourquoi" : De la Surveillance à la Compréhension

Jusqu'à présent, notre seule façon de savoir si l'application fonctionne est de l'utiliser. C'est du **monitoring réactif**.

Nous voulons passer à l'**observabilité**. La différence est fondamentale :
- Le **Monitoring** nous dit **SI** quelque chose ne va pas (ex: le site est inaccessible).
- L'**Observabilité** nous aide à comprendre **POURQUOI** ça ne va pas (ex: une requête SQL spécifique est devenue 100x plus lente).

Pour atteindre l'observabilité, nous avons besoin de collecter des données (les "indices") depuis notre système. Ces données sont les **3 Piliers de l'Observabilité** :
1.  **Logs** (Texte) : Ce qui s'est passé.
2.  **Metrics** (Nombres) : Comment ça se comporte.
3.  **Traces** (Chemins) : Le parcours d'une requête.

## 2. Notre Stratégie : Commencer par les Logs (Le "Quick Win")

**Pourquoi ne pas tout faire d'un coup ?**
Tenter d'implémenter les 3 piliers en même temps est complexe et coûteux. Nous allons adopter une approche itérative, en commençant par le pilier qui a le plus grand retour sur investissement immédiat : les **Logs**.

**Pourquoi les Logs en premier ?**
Pour 80% des bugs applicatifs, la réponse se trouve dans les logs. Centraliser les logs de tous nos conteneurs (Frontend, Backend, Nginx, DB) est le gain de productivité le plus important pour le débogage.

## 3. La Stack Choisie : Loki & Promtail

Pour la centralisation des logs, nous avons choisi la stack **Loki + Promtail + Grafana**.

**Pourquoi cette stack ?**
- **Simplicité & Efficacité :** Promtail est un agent ultra-léger qui écoute les logs Docker et les envoie à Loki. C'est "plug-and-play".
- **Écosystème Grafana :** Loki est conçu par Grafana Labs. L'intégration avec Grafana (notre outil de visualisation) est native et parfaite.
- **Coût :** Loki est optimisé pour ne pas indexer le contenu complet des logs, ce qui le rend moins cher à opérer à grande échelle que des solutions comme Elasticsearch.

**Pourquoi ne pas utiliser d'autres outils pour l'instant ?**
- **Elasticsearch (ELK Stack) :** Extrêmement puissant, mais beaucoup plus lourd et complexe à gérer. C'est un "marteau pour écraser une mouche" à notre échelle.
- **OpenTelemetry (OTel) :** C'est le futur standard pour collecter les 3 piliers. Cependant, l'instrumenter dans notre code (PHP/JS) juste pour des logs serait prématuré. Nous gardons OTel en tête pour le **Tracing** (Phase 5 ou 6), où il brille vraiment.

## 4. Le Plan d'Action Concret

1.  **Créer un `docker-compose.observability.yml` :** Nous allons isoler notre stack de monitoring pour pouvoir l'activer/désactiver à volonté sans polluer notre `docker-compose.override.yml` de dev.
2.  **Déployer Loki, Promtail, Grafana :** Ajouter ces 3 services dans le nouveau fichier.
3.  **Configurer Promtail :** Lui donner les permissions d'accéder au "socket" Docker pour qu'il puisse découvrir et lire les logs de tous les conteneurs.
4.  **Configurer Grafana :** Ajouter Loki comme source de données.
5.  **Explorer :** Lancer une requête LogQL pour visualiser les logs de l'API et de Nginx dans une seule interface.

## 5. Vers où on va (Les Prochaines Phases)

Une fois les logs en place, la voie est tracée :
- **Phase 4.5 (Résilience) :** Maintenant qu'on peut "voir" les erreurs, on va simuler des pannes (DB lente, API qui crash) et voir comment le système réagit.
- **Phase 5 (Metrics & Alerting) :** On ajoutera **Prometheus** pour collecter les métriques. On créera des dashboards dans Grafana et des alertes pour être prévenus proactivement des problèmes de performance.
- **Phase 6 (Tracing) :** On instrumentera notre code avec **OpenTelemetry** pour obtenir des traces distribuées et comprendre les goulots d'étranglement.

Cette approche itérative nous permet de construire une stack d'observabilité de niveau professionnel, brique par brique, en comprenant la valeur de chaque élément.
