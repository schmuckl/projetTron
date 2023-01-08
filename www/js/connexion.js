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
    let formulaireConnexion = document.getElementById("formulaireConnexion");
    let infosConnexion = document.getElementById("infosConnexion");
    let infosFileDattente = document.getElementById("infosFileDattente");
    let pfileDattente = document.getElementById("fileDattente");
    let pfileNbJoueurs = document.getElementById("fileNbJoueurs");


    // Maj du nombre de joueurs présents dans la queue
    if (messageJson.type == "majNbJoueurs") {
        pfileNbJoueurs.innerHTML = messageJson.nbJoueurs + "/2";
    }

    console.log(messageJson);

    // Dans le cas où le client s'est connecté, on lance la file d'attente
    if (messageJson.type == "connexion" && messageJson.statut) {
        msg = {
            type : "attenteDunePartie",
            pseudo : messageJson.pseudo
        }
        formulaireConnexion.style.visibility = "hidden";
        infosConnexion.style.visibility = "visible";
        let pPseudo = document.getElementById("infosPseudo");
        pPseudo.innerHTML = messageJson.pseudo;
        ws.send(JSON.stringify(msg));
    }
    // Dans le cas où le joueur est en file d'attente, on l'affiche à ce dernier
    if (messageJson.type == "fileDattente") {
        infosFileDattente.style.visibility = "visible";
        if (!messageJson.salle.sallePleine) {
            pfileDattente.innerHTML = "Dans la file d'attente de la salle " + messageJson.salle.id;
        } else if (messageJson.salle.sallePleine) {
            pfileDattente.innerHTML = "Dans la file d'attente de la salle " + messageJson.salle.id;
            msg = {
                type : "lancementPartie",
                salleId : messageJson.salle.id,
                joueurs : messageJson.salle.joueurs
            }
            ws.send(JSON.stringify(msg));
        }
    }

    if (messageJson.type = "lancementPartie") { // On lance la partie
        // let joueurs = messageJson.salle.joueurs;
        // joueurs.forEach(j => {
        //     console.log(j);
        // });
        // window.location.href = "../tron.html";
    }
}




// Quand le client appuie sur le bouton se connecter
ws.meConnecter = function () {
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
    ws.send(JSON.stringify(msg));
};