# DevOps & SRE Path - Dockerization & Orchestration

## PHASE 1 — Docker comme infrastructure locale

- [x] **STEP 1 — Services externes conteneurisés** (VALIDÉ)
  - **Cas :** MySQL (remplacé par PostgreSQL), Redis
  - **Apprentissages :** Volumes, Réseau, Ports, Lifecycle, Docker Compose, Variables d'environnement
  - **Valeur :** Environnements reproductibles, Onboarding rapide

- [x] **STEP 1.5 — Lifecycle, résilience minimale & erreurs réelles** (VALIDÉ)
  - **Cas :** Redémarrage DB, Redis indisponible, Crash conteneur
  - **Apprentissages :** Restart policies (unless-stopped), Healthchecks (pg_isready, redis-cli ping), Variable escaping ($$)
  - **Valeur :** 🔥🔥🔥 Savoir raisonner sur les pannes avant la prod

## PHASE 2 — Containerisation applicative

- [x] **STEP 2 — Containeriser le backend (Laravel API)** (VALIDÉ)
  - **Objectif :** Artefact immuable
  - **Concepts :** Image vs conteneur, Build vs Run, Dockerfile contract, Nginx + PHP-FPM (Découplage), DNS Interne
  - **Valeur :** 🔥🔥🔥🔥 Standardisation des déploiements

- [x] **STEP 2.5 — Containeriser le frontend (React)**
  - **Objectif :** Serving statique Nginx
  - **Concepts :** Multi-stage builds, Séparation build/serve
  - **Valeur :** Performance, Simplicité d’exploitation

## PHASE 3 — Architecture complète locale (parité dev/prod)

- [ ] **STEP 3 — Environnement complet orchestré (docker-compose)**
  - **Stack :** Nginx, React, Laravel, MySQL, Redis
  - **Concepts :** DNS interne, Réseaux, Dépendances
  - **Valeur :** 🔥🔥🔥🔥🔥 Vision systémique, Débogage réel

- [ ] **STEP 3.5 — Configuration & secrets**
  - **Cas :** Multi-environnements, Variables sensibles
  - **Concepts :** Config ≠ code, Secrets runtime
  - **Valeur :** 🔥🔥🔥🔥 Sécurité, Auditabilité

## PHASE 4 — Exécution production-grade

- [ ] **STEP 4 — Observabilité fondamentale**
  - **Piliers :** Logs structurés, Metrics, Health endpoints
  - **Valeur :** 🔥🔥🔥🔥🔥 Diagnostic rapide, Réduction MTTR

- [ ] **STEP 4.5 — Résilience & gestion des pannes**
  - **Cas :** DB lente, Cache down
  - **Concepts :** Graceful shutdown, Timeouts, Retries, Circuit breakers
  - **Valeur :** 🔥🔥🔥🔥🔥 Robustesse en production

## PHASE 5 — Déploiement & évolution du système

- [ ] **STEP 5 — Stratégies de déploiement**
  - **Stratégies :** Rolling, Blue/Green, Canary
  - **Valeur :** 🔥🔥🔥🔥🔥🔥 Réduction du risque business

- [ ] **STEP 5.5 — CI/CD & promotion d’artefacts**
  - **Concepts :** Build once deploy many, Environnements immuables
  - **Valeur :** 🔥🔥🔥🔥🔥 Déploiements fiables

## PHASE 6 — Sécurité & industrialisation

- [ ] **STEP 6 — Sécurité container & supply chain**
  - **Concepts :** Images minimalistes, Non-root, SBOM
  - **Valeur :** 🔥🔥🔥🔥 Sécurité by design

## PHASE 7 — Orchestration

- [ ] **STEP 7 — Kubernetes**
  - **Approche :** Mapping Docker-compose → K8s
  - **Valeur :** 🔥🔥🔥🔥🔥 Scalabilité réelle
