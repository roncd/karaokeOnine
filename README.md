# Karaoké O'nine
Projet GitOps - Petite plateforme de karaoké en salle.
[Cahier des charges](docs/Fiche-Projet-DevOps.pdf)
Réalisé par Rosalie NICAUD, Laetitia TANOH, Marie Paule Yvette LOKO et Doryan VOUSEMER.

## Workflow
Avant d'effectuer des  modifications sur le repository, informez d'abord les autres membres de l'équipe.

Suivez les règles suivantes lorsque vous effectuez des modifications sur le repository.

### Règles du Git
* Les commits sont courts et clairs.
* Toutes les modifications passent par une branche `feature/...`.
* On ne pousse jamais directement sur `main` ou `staging`, toujours via PR.
* Une PR nécessite au moins une review d'un autre membre avant merge.
* Avant de créer une branche, toujours faire un `git pull`.
* Supprimer la branche `feature/` après merge.
* Ne pas push de données sensibles.

### Branches 
* `main` : stable, code prêt pour la production
* `staging` : stable, intégration des fonctionnalités
* `feature/...` : une fonctionnalité par branche

### Commit
| Type | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `test:` | Ajout de tests |
| `docs:` | Documentation |
| `ci:` | Pipeline CI/CD |
| `chore:` | Fichiers techniques |

### Fonctionnement du flux GitOps
#### [Developpeur ouvre PR branch feature/... vers staging] 
* review du code par un autre membre de l'équipe + validation.
* ci.yml se déclenche automatiquement (effectue les tests).


#### [Merge automatique branch feature vers staging]
* cd.yml se déclenche automatiquement (staging).
1. Build l'image Docker.
2. Met à jour le fichier ops/overlays/staging/.env avec le nouveau tag.
3. Déploie sur le serveur staging.


#### [Ouverture manuelle PR branch staging vers main]
* vérification manuelle du bon fonctionnement du déploiement staging + validation. 
* cd.yml se déclenche automatiquement (prod).

## Choix des technologies 