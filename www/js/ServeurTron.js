// const bdd = require('./gestionBdd/initDataBdd.js')
const {Joueur} = require("./Joueurs/Joueur");
const {JoueursConnectesListe} = require("./Joueurs/JoueursConnectesListe");
const {SallesController} = require("./Salles/SallesController");
const events = require('events');
const eventEmitter = new events.EventEmitter();
const http = require('http');
const server = http.createServer();
server.listen(9898); 

const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server
});

let sockets = [];

wsServer.on('request', function (request) {
    const connexion = request.accept(null, request.origin);

    sockets.push(connexion);

    // Le joueur en cours
    let joueur = null;

    connexion.on('message', function (message) {

        message = JSON.parse(message.utf8Data);

        // Gestion des salles "d'attente" et des salles où il faut lancer la partie, ainsi que de la connexion des joueurs
        if (message.type == "connexion") {
            // Dans le cas où le joueur n'existe pas, on va le créer
            connexionJoueurs(message, connexion);
        }
        if (message.type == "attenteDunePartie") {
            joueur = new Joueur(message.pseudo);
            attenteDunePartie(joueur, connexion);
        }
        // if (message.type == "lancementPartie") {
        //     lancementPartie(message, connexion);
        // }
    });

    // Quand la websocket se ferme, l'utilisateur ferme son onglet ou navigateur ou par un timer qu'on a mis (pas notre cas ici)
    connexion.on('close', function (reasonCode, description) {
        // on affiche dans la console du serveur que la websocket est fermé 
        console.log(reasonCode + ". Tu as fermé la websocket : " + description);
        sockets = sockets.filter(s => s !== connexion);
    });

    connexion.on('error', function () {
        console.log("Some Error occurred");
    });

});

// Gère la connexion et la création d'un joueur
function connexionJoueurs(message, connexion) {

    // Message à renvoyer
    let messageJson = {
        type : "connexion",
        statut : false,
        message : "",
        pseudo : ""
    }

    if (JoueursConnectesListe.isJoueurConnecte(message.pseudo) == true) {
        messageJson.message = "Vous êtes déjà connecté autre part.";
    } else {
        let j = new Joueur(message.pseudo, message.password, 0);
        // On regarde s'il existe
        messageJson = j.findJoueurBdd();

        console.log(messageJson);
    }

    if (messageJson.statut == true) JoueursConnectesListe.ajouterJoueur(j);
    // TODO LE MESSAGE EST PAS BON 
    messageJson.pseudo = message.pseudo;
    connexion.send(JSON.stringify(messageJson));
}

// Gère le lancement d'une file d'attente
function attenteDunePartie(joueur, connexion) {
    
    console.log("attentedunepartie()");
    // On ajoute le joueur à la salle d'attente
    let salleDattente = SallesController.ajouterJoueurDansSalle(joueur);

    let messageJson = {
        type : "fileDattente",
        salle : {
            id : salleDattente.id,
            joueurs : salleDattente.getJoueurs(),
            sallePleine : false
        }
    }

    let msgInfosNbJoueurs = {
        type : "majNbJoueurs",
        nbJoueurs : salleDattente.getNbJoueurs()
    }
    connexion.send(JSON.stringify(msgInfosNbJoueurs));
    connexion.send(JSON.stringify(messageJson));

    if (salleDattente.isSallePleine()) {
        messageJson.salle.sallePleine = true;
        lancementPartie(messageJson, connexion);
    }
}

// Gère le lancement de la partie
function lancementPartie(message, connexion) {
    let joueurs = message.salle.joueurs;
    let salleId = message.salle.id;
    console.log("LANCEMENT PARTIE");
    console.log(joueurs);
    let msg = {
        type : "lancementPartie",
        salleId : salleId,
        joueurs : joueurs
    }
    connexion.send(JSON.stringify(msg));
    // On les envoi sur le jeu en mettant les joueurs à leurs positions de départs

}