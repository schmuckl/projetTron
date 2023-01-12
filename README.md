# ProjetTron

Initialisation :

Se placer dans le dossier du cours Web Client 2;
Faire un git clone du projet dans ce dossier;
Créer un dossier BDD dans le dossier du projet;
Lancer l'environnement "WebDev" (définit par le prof) via la commande "./LaunchCordova.bat[sh]" ou "conda activate WebDev";
Ouvrir une invite de commande, se positionner dans les dossiers "Serveur" puis "Client" et lancer les commandes suivantes :
    - cordova platform add browser
    - cordova platform add android
    - npm install

Initialisation BDD :
Après avoir installé MongoDB, on peut lancer la BDD via la commande (sous WebDev) "mongod --dbpath="[path to project files]/Serveur/gestionBdd/BDD";
- Créer une BDD projetTron
<!-- - Créer une collection Joueurs -->
- Installer mongoose si besoin (npm install mongoose)
- Lancer la commande "node gestionBdd/initDataBdd.js"

Pour lancer le serveur et l'application :
Dans le dossier "Serveur", lancer la commande "node js/ServerTron";
Le serveur se lance dans cette invite de commande;
Dans une autre invite de commande, se mettre dans le dossier "Client" et lancer la commande "cordova run browser".



Commandes git :
- git status : affiche le statut des fichiers modifiés et autres
- git stash : fais une sauvegarde en local des fichiers modifiés
- git fetch : récupère les infos du repository
- git pull : mets à jour le code local avec celui du repository distant
- git stash pop : restore les fichiers présents dans le stash effectué précédemment