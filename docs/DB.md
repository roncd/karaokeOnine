# PostgreSQL

## Installation de PostgreSQL en local

Téléchargez PostgreSQL sur votre machine soit via le [site officiel](https://www.postgresql.org/download/) soit via le terminal.

```bash
# Mac
brew install postgresql@16

# Linux
sudo apt install postgresql

# Windows
# Télécharger l'installeur sur https://www.postgresql.org/download/
```

Vérifiez l'installation :

```bash
psql --version
```

## Création des bases de données en local

Le projet utilise **deux bases de données** :

| DB | Usage |
|---|---|
| `karaoke_dev` | Développement:  les vraies données |
| `karaoke_test` | Tests automatisés: vidée et recréée à chaque test |

> Les tests n'écrivent jamais dans `karaoke_dev`. Les données de développement sont toujours préservées.

### Créer les deux bases

```bash
# Connexion à PostgreSQL
psql -U postgres

# Création des bases
CREATE DATABASE karaoke_dev;
CREATE DATABASE karaoke_test;

# Quitter
\q
```

### Effecuter les migrations sur les deux bases

```bash
# Base de développement
psql -U postgres -d karaoke_dev -f backend/src/db/migrations/init.sql

# Base de test
psql -U postgres -d karaoke_test -f backend/src/db/migrations/init.sql
```

## Configuration du fichier `.env`

Copiez le fichier `.env.example` et remplissez vos propres valeurs :

```env
# backend/.env
PORT=3000
NODE_ENV=dev
DB_URL=postgresql://USER:VOTRE_MDP@localhost:5432/karaoke_dev
TEST_DB_URL=postgresql://USER:VOTRE_MDP@localhost:5432/karaoke_test
```

> Ne commitez jamais le fichier `.env` — il contient vos identifiants et mots de passe. Seul `.env.example` est commité.

---

## Insertion des données de test

Un jeu de données est fourni pour le développement. Pour l'éxecuter : 

```bash
psql -U postgres -d karaoke_dev -f backend/src/db/seeds/songs.sql
```

---

## Commandes utiles (shell psql)

```bash
# Se connecter à une base
psql -U postgres -d karaoke_dev
```

| Commande | Action |
|---|---|
| `\l` | Lister les bases de données |
| `\dt` | Lister les tables de la base courante |
| `\d nom_table` | Voir la structure d'une table |
| `SELECT * FROM salon;` | Voir le contenu d'une table |
| `DELETE FROM salon;` | Vider une table |
| `\q` | Quitter le shell psql |

---

## Réinitialiser une base

```bash
psql -U postgres

DROP DATABASE karaoke_dev;
CREATE DATABASE karaoke_dev;
\q

psql -U postgres -d karaoke_dev -f backend/src/db/migrations/init.sql
```