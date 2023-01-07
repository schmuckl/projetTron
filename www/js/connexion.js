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

    console.log(messageJson);
    
    let msg;

    if (messageJson.type == "connexion" && messageJson.statut) {
        msg = {
            type : "attenteDunePartie",
            pseudo : messageJson.pseudo
        }
        ws.send(JSON.stringify(msg));
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