// const bdd = require('./gestionBdd/initDataBdd.js')
const {Joueur} = require("./Joueurs/Joueur");
const {JoueursConnectesListe} = require("./Joueurs/JoueursConnectesListe");
const {SallesController} = require("./Salles/SallesController");
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
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
        if (message.type == "lancementPartie") {
            lancementPartie(message);
        }
    });

    // Quand la websocket se ferme, l'utilisateur ferme son onglet ou navigateur ou par un timer qu'on a mis (pas notre cas ici)
    connexion.on('close', function (reasonCode, description) {
        // on affiche dans la console du serveur que la websocket est fermé 
        console.log(reasonCode + ". Tu as fermé la websocket :( " + description);
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
        if (j.findJoueurBdd()) {
            messageJson.message = "Votre compte existe déjà.";
        } else { // On créer le joueur avec le pseudo et le mdp rentré dans le message
            j.saveJoueurBdd();
            messageJson.message = "Votre compte a bien été créé.";
        }
        JoueursConnectesListe.ajouterJoueur(j);
        messageJson.statut = true;
    }
    messageJson.pseudo = message.pseudo;
    connexion.send(JSON.stringify(messageJson));
}

// Gère le lancement d'une file d'attente
function attenteDunePartie(joueur, connexion) {
    
    // On ajoute le joueur à la salle d'attente
    let salleDattente = SallesController.ajouterJoueurDansSalle(joueur);

    // Si la salle est pleine on lance la partie
    let messageJson = {
        type : "lancementPartie",
        salle : {
            id : salleDattente.id,
            joueurs : salleDattente.getJoueurs()
        }
    }
        connexion.send(messageJson);
}

function lancementPartie(message) {
    let joueurs = message.salle.joueurs;
    console.log("LANCEMENT PARTIE");
    console.log(joueurs);
    // On les envoi sur le jeu en mettant les joueurs à leurs positions de départs

}