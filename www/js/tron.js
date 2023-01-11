const ws = new WebSocket('ws://localhost:9898/');

let grille = new Grille(tailleGrille);

function init() {
    console.log("ROMAIN EST TROP FOR");
    creerGrille();
    setPositionsMur();
    setPositionsDepart();
    ecouterJoueur();
}

// On créer la grille de jeu
function creerGrille() {
    
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
    return;
}

function setPositionsDepart() {
    grille.cases.forEach(case_ => {
        if(case_.pos_x == position_joueur_depart_1.x && case_.pos_y == position_joueur_depart_1.y) {
            case_.setDepart();
        }
        if(case_.pos_x == position_joueur_depart_2.x && case_.pos_y == position_joueur_depart_2.y) {
            case_.setDepart();
        }
    });

    console.log(grille.cases);
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

function addNewPosition(la_case) {
    document.getElementById(la_case.val).classList.add("currentPosition");
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
                majMouvement(position_joueur, 40);

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
                majMouvement(position_joueur, 38);
                
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
                majMouvement(position_joueur, 37);

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
                
                majMouvement(position_joueur, 39);

            }, 300);
            break;
    }
}


function majMouvement(position_joueur, keycode) {

    let msg = {
        type : "mouvementJoueur",
        salleId : localStorage.getItem("salleId"),
        joueur : {
            pseudo : localStorage.getItem("pseudo"),
            pos_x : position_joueur.x,
            pos_y : position_joueur.y,
        }
    }

    console.log(msg);

    case_ = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
    case_.setMurJoueur();
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

    if (gameOver(new_case)) {
        msg.type = "gameOver";
    } else {
        addNewPosition(new_case);
    }

    ws.send(JSON.stringify(msg));
}

// Ajout de l'eventListener pour les flèches directionnelles
function ecouterJoueur() {
    window.addEventListener("keyup", mouvement);
}

function majMouvementAdverse(joueur) {

    case_ = grille.getCaseByCoord(joueur.position.pos_x, joueur.position.pos_y);
    case_.setMurJoueur();

}

//si la nouvelle case est un mur, alors c'est perdu
function gameOver(case_) {
    if (case_.isWall) {
        window.removeEventListener("keyup", mouvement);
        stopInterval();
        return true;
    }
    return false;
}