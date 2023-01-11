
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

function rejouer() {

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
    let divInfosJeu = document.getElementById("infosJeu");
    let pInfosJoueursPresents = document.getElementById("joueursPresents");
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

            let p = document.createElement("p");
            p.innerHTML = "Vous êtes connectés en tant que " + messageJson.pseudo + "<br>Score actuel : " + messageJson.score;
            infosConnexion.append(p);

            ws.send(JSON.stringify(msg));
            break;

        // Dans le cas où le joueur est en file d'attente
        case 'fileDattente' :
            infosFileDattente.style.visibility = "visible";
            pfileDattente.innerHTML = "Dans la file d'attente de la salle " + messageJson.salle.id;
            break;

        // Maj du nombre de joueurs présents dans la queue
        case 'majNbJoueurs' :
            if (messageJson.salle.nbJoueurs > 1) {
                divInfosJeu.style.visibility = "visible";
                let i = 0;
                messageJson.salle.joueurs.forEach(j => {
                    if (j.pseudo != localStorage.getItem("pseudo")) {
                        if (i == 0) pInfosJoueursPresents.innerHTML += j.pseudo;
                        else pInfosJoueursPresents.innerHTML += " - " + j.pseudo;
                        i++;
                    }
                });
            }
            pfileNbJoueurs.innerHTML = messageJson.salle.nbJoueurs + "/" + nbMaxJoueurs;
            break;
            
        // Quand on peut lancer la partie
        case 'lancementPartie' :
            messageJson.salle.joueurs.forEach(j => {
                if (localStorage.getItem("pseudo") == j.pseudo) {
                    position_joueur = j.position;
                    couleur_joueur = j.couleur;
                }
            });

            divJeu.style.visibility = "visible";
            divConnexion.style.visibility = "hidden";
            infosFileDattente.style.visibility = "hidden";

            localStorage.setItem("salleId", messageJson.salle.id);

            init(messageJson.salle.joueurs);

            break;

        case 'mouvementAdverse':
            majMouvementAdverse(messageJson.salle.joueur);
            break;

        case 'finDePartie':
            finirPartie(messageJson.pseudo);
            break;
    }
}
