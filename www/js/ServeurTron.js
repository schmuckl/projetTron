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
async function connexionJoueurs(message, connexion) {

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
        messageJson = await j.findJoueurBdd();
        if (messageJson.statut == true) JoueursConnectesListe.ajouterJoueur(j);
    }

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
            joueurs : salleDattente.getJoueurs()
        }
    }

    let infosSalle = {
        idSalle : salleDattente.id,
        joueurs : salleDattente.getJoueurs(),
        nbJoueurs : salleDattente.getNbJoueurs()
    }

    // Permet d'envoyer la mise à jour du nombre de joueurs dans la salle à tous les clients présents dans cette salle
    eventEmitter.on("majNbJoueurs", (salle) => majNbJoueurs(salle, salleDattente.getId(), connexion));
    eventEmitter.emit("majNbJoueurs", infosSalle);
    
    // De la même manière que pour la mise à jour du nombre de joueurs dans la salle, on lance un message à tous les clients si la salle est pleine
    eventEmitter.on("lancementPartie", (salle) => lancementPartie(salle, salleDattente.getId(), connexion));
    
    if (salleDattente.isSallePleine()) {
        eventEmitter.emit("lancementPartie", infosSalle);
        lancementPartie(messageJson, connexion);
    }
    
    connexion.send(JSON.stringify(messageJson));
}

// Envoi un message au client pour le lancement de la partie
function lancementPartie(salle, salle_id, connexion) {

    if (salle.idSalle != salle_id) {
        return;
    }

    let msg = {
        type : "lancementPartie",
        salle : {
            id : salle.idSalle,
            joueurs : salle.joueurs
        }
    }
    connexion.send(JSON.stringify(msg));

}

// Envoi un message au client pour la MAJ du nombre de joueurs dans la salle d'attente
function majNbJoueurs(salle, salle_id, connexion) {
    
    if (salle.idSalle != salle_id) {
        return;
    }
    
    let msg = {
        type : "majNbJoueurs",
        salle : {
            id : salle.idSalle,
            joueurs : salle.joueurs,
            nbJoueurs : salle.nbJoueurs
        }
    }

    connexion.send(JSON.stringify(msg));
}