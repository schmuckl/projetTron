
function connexion() {
    let pseudo = document.getElementById("pseudo").value;
    let mdp = (CryptoJS.SHA3(document.getElementById("password").value)).toString();

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
    let divInfosJeu = document.getElementById("infosJeu");
    let pInfosJoueursPresents = document.getElementById("joueursPresents");
    let divJeu = document.getElementById("jeu");
    let divConnexion = document.getElementById("connexion");

    console.log(messageJson);

    switch(messageJson.type) {
        // Dans le cas d'une connexion réussie
        case 'connexion' :
            infosConnexion.style.visibility = "visible";
            if(messageJson.statut == false) {
                infosConnexion.innerHTML = "Vous êtes déjà connecté autre part";
                return;
            }
            msg = {
                type : "attenteDunePartie",
                pseudo : messageJson.pseudo
            }
            formulaireConnexion.style.visibility = "hidden";

            let p = document.createElement("p");
            p.id = "score";
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
            // On met a jour l'affichage du score du joueur actuel
            if (messageJson.joueur.pseudo == localStorage.getItem("pseudo")) {
                let p = document.getElementById("score");
                p.innerHTML = "Vous êtes connectés en tant que " + messageJson.joueur.pseudo + "<br>Score actuel : " + messageJson.joueur.score;
            }
            finirPartie(messageJson.pseudo);
            break;
    }
}
