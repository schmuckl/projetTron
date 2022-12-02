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


Pour lancer le serveur et l'application :
Toujours dans le même dossier, lancer la commande "node www/js/ServerWS";
Un serveur basique se lance dans cette invite de commande;
Dans une autre invite de commande, lancer "cordova build browser";
Ensuite, lancer "cordova run browser" et l'application se lance.