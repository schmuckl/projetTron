const ws = new WebSocket('ws://localhost:9898/');

function connexion() {
    let pseudo = document.getElementById("pseudo").value;
    let mdp = document.getElementById("password").value;

    let msg = null;

    console.log(pseudo);
    console.log(mdp);

    if (pseudo != null && mdp != null) {
        msg = {
            type : "connexion",
            pseudo: pseudo,
            password: mdp
        };
    }

    localStorage.setItem("pseudo", pseudo);
    localStorage.setItem("password", mdp);

    ws.send(JSON.stringify(msg));
}

ws.onmessage = function(message) {

    messageJson = JSON.parse(message.data);

    let msg;

    // Pour tous les affichages aux clients
    let formulaireConnexion = document.getElementById("formulaireConnexion");
    let infosConnexion = document.getElementById("infosConnexion");
    let infosFileDattente = document.getElementById("infosFileDattente");
    let pfileDattente = document.getElementById("fileDattente");
    let pfileNbJoueurs = document.getElementById("fileNbJoueurs");
    let divJeu = document.getElementById("jeu");
    let divConnexion = document.getElementById("connexion");

    console.log(messageJson);

    switch(messageJson.type) {
        // Dans le cas d'une connexion réussie
        case 'connexion' :
            msg = {
                type : "attenteDunePartie",
                pseudo : messageJson.pseudo
            }
            formulaireConnexion.style.visibility = "hidden";
            infosConnexion.style.visibility = "visible";
            let pPseudo = document.getElementById("infosPseudo");
            pPseudo.innerHTML = messageJson.pseudo;
            ws.send(JSON.stringify(msg));
            break;

        // Dans le cas où le joueur est en file d'attente
        case 'fileDattente' :
            infosFileDattente.style.visibility = "visible";
            pfileDattente.innerHTML = "Dans la file d'attente de la salle " + messageJson.salle.id;
            break;

        // Maj du nombre de joueurs présents dans la queue
        case 'majNbJoueurs' :
            pfileNbJoueurs.innerHTML = messageJson.salle.nbJoueurs + "/2";
            break;
            
        case 'lancementPartie' :

            messageJson.salle.joueurs.forEach(j => {
                if (localStorage.getItem("pseudo") == j.pseudo) {
                    position_joueur = j.position;
                }
            });

            divJeu.style.visibility = "visible";
            divConnexion.style.visibility = "hidden";

            break;
    }
}

// Quand le client appuie sur le bouton se connecter
ws.meConnecter = function () {
    let pseudo = document.getElementById("pseudo").value;
    let mdp = document.getElementById("password").value;

    let msg = null;

    if (pseudo != null && mdp != null) {
        msg = {
            type : "connexion",
            pseudo: pseudo,
            password: mdp
        };
    }
    ws.send(JSON.stringify(msg));
};