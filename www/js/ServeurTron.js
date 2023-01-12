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
let tailleGrille = 30;

wsServer.on('request', function (request) {
    const connexion = request.accept(null, request.origin);

    sockets.push(connexion);

    // Le joueur en cours
    let joueur = null;

    connexion.on('message', async function (message) {

        message = JSON.parse(message.utf8Data);

        // Gestion de la connexion utilisateur, de la salle d'attente et des mouvements de joueurs
        if (message.type == "connexion") {
            // Dans le cas où le joueur n'existe pas, on va le créer
            joueur = await connexionJoueurs(message, connexion);

        } else if (message.type == "attenteDunePartie") {
            attenteDunePartie(joueur, connexion);

        } else if (message.type == "mouvementJoueur") {
            mouvementJoueur(joueur, message);

        } else if (message.type == "perdu") {
            finDePartie(joueur);
        }
    });

    // Quand la connexion se ferme
    connexion.on('close', function (reasonCode, description) {
        
        // On enlève le joueur de la liste des joueurs connectés
        JoueursConnectesListe.supprimerJoueur(joueur);

        console.log("Websocket fermé - code : " + reasonCode + " - raison : " + description);
        sockets = sockets.filter(s => s !== connexion);
    });

    connexion.on('error', function () {
        console.log("Une erreur est survenue");
    });

});

// Gère la connexion et la création d'un joueur
async function connexionJoueurs(message, connexion) {

    // Message à renvoyer
    let messageJson = {
        type : "connexion",
        statut : false,
        message : ""
    }

    let j = null;

    if (JoueursConnectesListe.isJoueurConnecte(message.pseudo) == true) {
        messageJson.message = "Vous êtes déjà connecté autre part.";
    } else {
        j = new Joueur(message.pseudo, connexion, message.password);
        // On regarde s'il existe
        messageJson = await j.findJoueurBdd();
        if (messageJson.statut == true) {
            JoueursConnectesListe.ajouterJoueur(j);
            j.setScore(messageJson.score);
        }
    }
    messageJson.pseudo = message.pseudo;
    connexion.send(JSON.stringify(messageJson));
    return j;
}

// Gère le lancement d'une file d'attente
function attenteDunePartie(joueur, connexion) {
    
    // On ajoute le joueur à la salle d'attente
    let salleDattente = SallesController.ajouterJoueurDansSalle(joueur);

    let messageJson = {
        type : "fileDattente",
        salle : {
            id : salleDattente.id,
            joueurs : salleDattente.getInfosJoueurs()
        }
    }

    let infosSalle = {
        idSalle : salleDattente.id,
        joueurs : salleDattente.getInfosJoueurs(),
        nbJoueurs : salleDattente.getNbJoueurs()
    }

    // Permet d'envoyer la mise à jour du nombre de joueurs dans la salle à tous les clients présents dans cette salle
    eventEmitter.on("majNbJoueurs", (salle) => majNbJoueurs(salle, salleDattente.getId(), connexion));
    eventEmitter.emit("majNbJoueurs", infosSalle);
    
    // De la même manière que pour la mise à jour du nombre de joueurs dans la salle, on lance un message à tous les clients si la salle est pleine
    eventEmitter.on("lancementPartie", (salle) => lancementPartie(salle, salleDattente.getId(), connexion));
    
    if (salleDattente.isSallePleine()) {
        eventEmitter.emit("lancementPartie", infosSalle);
    }

    connexion.send(JSON.stringify(messageJson));
}

// Envoi un message au client pour le lancement de la partie
function lancementPartie(salle, salle_id, connexion) {

    let couleursJoueurs = ["red", "blue", "green", "purple"];

    if (salle.idSalle != salle_id) {
        return;
    }

    let position_joueur_depart1 = {
        x : 2,
        y : tailleGrille/2 - 1
    }

    let position_joueur_depart2 = {
        x : position_joueur_depart1.x + tailleGrille - 5,
        y : tailleGrille/2 - 1
    }

    // Permet de gérer la position initiale des joueurs pour 2 joueurs actuellement
    for (let i = 0; i < salle.nbJoueurs; i++) {
        const j = salle.joueurs[i];
        if (i == 0) {
            j.position = {
                x : position_joueur_depart1.x,
                y : position_joueur_depart1.y
            }
        } else {
            j.position = {
                x : position_joueur_depart2.x,
                y : position_joueur_depart2.y
            }
        }
        j.couleur = couleursJoueurs[i];
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


// Permet de gérer tous événements liés aux mouvements des joueurs et de l'envoyer à tous les clients de la même salle
function mouvementJoueur(joueur, message) {
    
    let salleDuJoueur = SallesController.getSalleByJoueurPseudo(joueur.getPseudo());

    let joueursDansLaSalle = salleDuJoueur.getJoueurs();

    let infosJoueur = {
        pseudo : "",
        position : {
            pos_x : 0,
            pos_y : 0
        },
        couleur : message.joueur.couleur
    }

    // On exclut le joueur "actuel" du message contenant les positions à envoyer
    infosJoueur.pseudo = joueur.getPseudo();
    infosJoueur.position.pos_x = message.joueur.pos_x;
    infosJoueur.position.pos_y = message.joueur.pos_y;
    
    let msg = {
        type : "mouvementAdverse",
        salle : {
            id : salleDuJoueur.getId(),
            joueur : infosJoueur
        }
    }

    joueursDansLaSalle.forEach(j => {
        if (j.getPseudo() != joueur.getPseudo()) j.getConnexion().send(JSON.stringify(msg));
    });

}

// Permet de gérer la fin de la partie
function finDePartie(joueur) {
    
    let salleDuJoueur = SallesController.getSalleByJoueurPseudo(joueur.getPseudo());

    let joueursDansLaSalle = salleDuJoueur.getJoueurs();

    let msg = {
        type : "finDePartie",
        pseudo : joueur.pseudo,
        joueur : {
            pseudo : "",
            score : 0
        }
    }

    // On met à jour les scores des autres joueurs

    joueursDansLaSalle.forEach(async j => {

        if (j.pseudo != joueur.pseudo) {
            j.setScore(j.getScore() + 1);
            let joueur = await j.majScoreJoueurBdd();
            msg.joueur.pseudo = joueur.pseudo;
            msg.joueur.score = joueur.score;
        }

        // On enlève tous les joueurs de la salle de jeu
        salleDuJoueur.supprimerJoueur(j);

        j.getConnexion().send(JSON.stringify(msg));
    });
}