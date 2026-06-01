# Expo
## Guide de lancement de l'application frontend
### Prérequis
Installer :
* [Node.js](https://nodejs.org/) version 18 ou supérieure
* [Git](https://git-scm.com/)

### Installation des dépendances 
À partir de la racine du projet, déplacez-vous dans `frontend/` puis installez les dépendances : 
```bash
cd frontend
npm install
```
## Lancer l'application sur mobile via Expo Go
### Etape 1 : Installer Expo Go sur mobile
* Téléchargez l'application Expo Go sur son mobile depuis l'App Store ou Google Play.

### Etape 2 : Lancer le serveur Expo
* Entrez les commandes suivantes dans le terminal dans le répertoire `frontend/` :
```bash
npx expo start
```
Dans le terminal s'affiche normalement un QR code.

### Etape 3 : Scanner le QR code
* Scannez les QR code sur son mobile.
> Pour que cela fonctionne il faut que le mobile et l'ordinateur soit connectés au même réseau Wi-Fi.

### Etape 4 : L'application se lance
* L'application se lance sur Expo Go automatiquement. Le code se recharge en temps réel lors de modification.

## Lancer l'application sur le serveur web
### Etape 1 : Lancer le serveur web
À partir de `frontend/` entrez la commande suivante : 
```bash
npx expo start --web
```

### Etape 2 : Accéder à l'application 
Le navigateur s'ouvre automatiquement sur `http://localhost:8081`.
Si le navigateur ne s'ouvre pas automatiquement, allez manuellement sur :  `http://localhost:8081` via le navigateur.

### Build web statique (pour production)
Pour générer les fichiers statiques de la production : 
```bash
npx expo export --platform web
```
Les fichiers sont générés dans le dossier `dist/`. C'est ce dossier qui est servi par Nginx dans le conteneur Docker.

## Commandes utiles

| Commande | Action |
|---|---|
| `r` dans le terminal | Recharger l'application |
| `m` dans le terminal | Ouvrir le menu développeur |
| `w` dans le terminal | Ouvrir dans le navigateur |
| `Ctrl + C` | Arrêter le serveur |