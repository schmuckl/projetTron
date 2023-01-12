const ws = new WebSocket('ws://localhost:9898/');

let grille = new Grille(tailleGrille);

function init(joueurs) {
    creerGrille();
    setPositionsDepart(joueurs);
    ecouterJoueur();
}

// On créer la grille de jeu
function creerGrille() {

    // Dans le cas où les joueurs demandent à rejouer, la grille est déjà créée
    if (grille.getCases() != null) {
        grille.getCases().forEach(c => {
            let td = document.getElementById(c.getValeur());
            td.removeAttribute("style");
        });
    } else {
        let valeurCase = 0;
        let cases = [];

        for(let i = 0; i < tailleGrille; i++) {
            document.getElementById("grille").appendChild(document.createElement("tr"));

            for(let j = 0; j < tailleGrille; j++) {
                let case_ = new Case(valeurCase, i, j);
                case_.creerCase(valeurCase);
                cases.push(case_);
                valeurCase++;
            }
        }
        grille.setCases(cases);
        setPositionsMur();
    }

    return;
}

function setPositionsDepart(joueurs) {

    joueurs.forEach(j => {
        const case_ = grille.getCaseByCoord(j.position.x, j.position.y);
        case_.setDepart(j.couleur);
    });
}

// Ajoute les murs sur les bords de la grille
function setPositionsMur() {

    cases = grille.getCases();
    let nbCasesTotal = tailleGrille * tailleGrille;

    for(let i = 0; i < tailleGrille; i++) {
        cases[i].isWall = true;
        document.getElementById(i).classList.add("MurPosition");
    }
    for(let i = 0 ; i <= nbCasesTotal - tailleGrille - 1; i+=tailleGrille) {
        cases[i].isWall = true;
        document.getElementById(i).classList.add("MurPosition");
    }
    for(let i = tailleGrille - 1; i <= nbCasesTotal - 1; i+=tailleGrille){
        cases[i].isWall = true;
        document.getElementById(i).classList.add("MurPosition");
    }
    for(let i = nbCasesTotal - tailleGrille - 1; i < nbCasesTotal; i++){
        cases[i].isWall = true;
        document.getElementById(i).classList.add("MurPosition");
    }

    grille.setCases(cases);
}

function addNewPosition(la_case, couleur_joueur) {
    let td = document.getElementById(la_case.val);
    td.setAttribute("style", "background-color:" + couleur_joueur);
}

// init un interval pour mouvement automatique 
let interval = 0;
// supprimer un interval
function stopInterval() {
    clearInterval(interval);
}

// Empêche au joueur d'aller dans la direction d'où il vient
    // Correspond au keyCode de la touche précédente
let directionPrecedente = 0;

// Fonction permettant la prise en compte des actions du joueur (flèches directionnelles)
// A chaque nouvelle position, on envoi un msg au serveur
function mouvement(event) {

    event.preventDefault();
    switch (event.keyCode) {
        case 40:
            if(directionPrecedente == 38) {
                return;
            }
            directionPrecedente = event.keyCode;
            stopInterval();
            interval = setInterval(function() {
                console.log("down");
                majMouvement(position_joueur, couleur_joueur, 40);

            }, 300);
            break;
        case 38:
            if(directionPrecedente == 40) {
                return;
            }
            directionPrecedente = event.keyCode;
            stopInterval();
            interval = setInterval(function() {
                console.log("up");
                majMouvement(position_joueur, couleur_joueur, 38);
                
            }, 300);
            break;
        case 37:
            if(directionPrecedente == 39) {
                return;
            }
            directionPrecedente = event.keyCode;
            stopInterval();
            interval = setInterval(function() {
                console.log("left");
                majMouvement(position_joueur, couleur_joueur, 37);

            }, 300);
            break;
        case 39:
            if(directionPrecedente == 37) {
                return;
            }
            directionPrecedente = event.keyCode;
            stopInterval();
            interval = setInterval(function() {
                console.log("right");
                
                majMouvement(position_joueur, couleur_joueur, 39);

            }, 300);
            break;
    }
}


function majMouvement(position_joueur, couleur_joueur, keycode) {

    let msg = {
        type : "mouvementJoueur",
        salleId : localStorage.getItem("salleId"),
        joueur : {
            pseudo : localStorage.getItem("pseudo"),
            pos_x : position_joueur.x,
            pos_y : position_joueur.y,
            couleur : couleur_joueur
        }
    }

    case_ = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
    case_.setPositionJoueur(couleur_joueur);
    switch(keycode) {
        case 40:
            position_joueur.y++;
            new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
            break;
        case 38:
            position_joueur.y--;
            new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
            break;
        case 37:
            position_joueur.x--;
            new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
            break;
        case 39:
            position_joueur.x++;
            new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
            break;
    }

    msg.joueur.pos_x = position_joueur.x;
    msg.joueur.pos_y = position_joueur.y;

    if (aPerdu(new_case)) {
        msg.type = "perdu";
    } else {
        new_case.setPositionJoueur(couleur_joueur);
    }

    ws.send(JSON.stringify(msg));
}

// Ajout de l'eventListener pour les flèches directionnelles
function ecouterJoueur() {
    interval = setInterval(function() {
        console.log("down");
        majMouvement(position_joueur, couleur_joueur, 40);

    }, 300);
    window.addEventListener("keyup", mouvement);
}

function majMouvementAdverse(joueur) {

    case_ = grille.getCaseByCoord(joueur.position.pos_x, joueur.position.pos_y);
    case_.setPositionJoueur(joueur.couleur);

}

//si la nouvelle case est un mur, alors c'est perdu
function aPerdu(case_) {
    if (case_.isWall) {
        window.removeEventListener("keyup", mouvement);
        stopInterval();
        return true;
    }
    return false;
}

// Permet de gérer l'affichage lié à la fin d'une partie
function finirPartie(pseudo) {
    window.removeEventListener("keyup", mouvement);
    stopInterval();
    
    console.log(pseudo + " a perdu, la partie s'arrête");
    let divJeu = document.getElementById("jeu");
    divJeu.style.visibility = "hidden";
    
    let infosFileDattente = document.getElementById("infosFileDattente");
    infosFileDattente.style.visibility = "hidden";
    let divInfosJeu = document.getElementById("infosJeu");
    divInfosJeu.style.visibility = "hidden";
    
    let infosConnexion = document.getElementById("infosConnexion");
    let btn = document.getElementById("rejouer");
    btn.style.visibility = "visible";
    btn.onclick = function() {
        ws.send(JSON.stringify({
            type : "attenteDunePartie",
            pseudo : pseudo
        }));
        btn.style.visibility = "hidden";
    }
    infosConnexion.append(btn);
}