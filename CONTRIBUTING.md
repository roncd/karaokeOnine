# Workflow
Avant d'effectuer des  modifications sur le repository, informez d'abord les autres membres de l'équipe.

Suivez les règles suivantes lorsque vous effectuez des modifications sur le repository.

## Règles du Git
* Les commits sont courts et clairs.
* Toutes les modifications passent par une branche feature/xxx.
* On ne pousse jamais directement sur main ou staging, toujours via PR.
* Une PR nécessite au moins une review d'un autre membre avant merge.


## Fonctionnement du flux GitOps
#### [Dev ouvre PR branch feature/xxx vers staging] 
* review du code par un autre membre de l'équipe + validation.
* ci.yml se déclenche automatiquement (effectue les tests).


#### [Merge automatique branch feature vers staging]
* deploy.yml se déclenche automatiquement (staging).
1. Build l'image Docker.
2. Met à jour le fichier ops/overlays/staging/.env avec le nouveau tag.
3. Déploie sur le serveur staging.


#### [Ouverture manuelle PR branch staging vers main]
* vérification manuelle du bon fonctionnement du déploiement staging + validation. 
* deploy.yml se déclenche automatiquement (prod).