# ProjetTron

Initialisation :

Se placer dans le dossier du cours Web Client 2;
Faire un git clone du projet dans ce dossier;
Créer un dossier BDD dans le dossier du projet;
Lancer l'environnement "WebDev" (définit par le prof) via la commande "./LaunchCordova.bat[sh]" ou "conda activate WebDev";
Ouvrir une invite de commande et lancer les commandes suivantes :
    - cordova platform add browser
    - cordova platform add android
    - npm install websocket

Initialisation BDD :
Après avoir installé MongoDB, on peut lancer la BDD via la commande (sous WebDev) "mongod --dbpath="[path to project files]/BDD";
- Créer une BDD projetTron
<!-- - Créer une collection Player -->
- Installer mongoose si besoin (npm install mongoose)

Pour lancer le serveur et l'application :
Toujours dans le même dossier, lancer la commande "node www/js/ServerWS";
Un serveur basique se lance dans cette invite de commande;
Dans une autre invite de commande, lancer "cordova build browser";
Ensuite, lancer "cordova run browser" et l'application se lance.



Commandes git :
- git status : affiche le statut des fichiers modifiés et autres
- git stash : fais une sauvegarde en local des fichiers modifiés
- git fetch : récupère les infos du repository
- git pull : mets à jour le code local avec celui du repository distant
- git stash pop : restore les fichiers présents dans le stash effectué précédemment