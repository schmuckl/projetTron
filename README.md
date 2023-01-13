# ProjetTron

Installation : 
- Lancer l'environnement "WebDev" via la commande "./LaunchCordova.bat[sh]" ou "conda activate WebDev"
- Se positionner dans le dossier "Serveur" et lancer la commande :
    - npm install
- Se positionner dans le dossier "Client" et lancer les commandes :
    - npm install
    - cordova platform add browser
    - cordova platform add android

Initialisation :
- Lancer l'environnement "WebDev" via la commande "./LaunchCordova.bat[sh]" ou "conda activate WebDev"
- Créer un dossier BDD sous Serveur/gestionBdd
- Lancer la commande : 
    - mongod --dbpath="Serveur/gestionBdd/BDD"
- Pour créer la collection joueurs, lancer la commande :
    - node Serveur/gestionBdd/initDataBdd.js

Lancement du jeu :
- Lancer le serveur avec la commande : 
    - node Serveur/js/ServeurTron
- Se positionner dans le dossier Client et lancer la commande :
    - cordova run browser