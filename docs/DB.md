# PostgreSQL
## Installation de PostgreSQL en local
* Télécharger PostgreSQL sur sa machine soit via le [site officiel](https://www.postgresql.org/download/) soit via le terminal.
* Entrer la commande suivante pour vérifier l'installation
```bash
psql --version
```
## Création de la base de donnée en local 
* Entrez les commandes suivantes dans le terminal 
```bash
# Connexion à PostgreSQL
psql -U postgres
# Dans le shell psql, création de la base
CREATE DATABASE karaoke_dev;
# Connexion à la base
\c karaoke_dev
# Quitter
\q
```
* Exécution du fichier de migration
```bash
psql -U postgres -d karaoke_dev -f backend/src/db/migrations/init.sql
```
## Commandes utiles (shell psql) 
| Commande | Action |
|---|---|
| `\l` | Liste les bases de données |
| `\dt` | Liste les tables de la base de données |
| `\d nom_de_table` | Voir une table |
| `\q` | Quitter le shell psql |