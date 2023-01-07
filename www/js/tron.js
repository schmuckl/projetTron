
let grille = new Grille(tailleGrille);


function init() {
    // position_joueur_1 = position_joueur_depart_1;
    // position_joueur_2 = position_joueur_depart_2;
    // addNewPosition(cases[position_joueur.x][position_joueur.y]);
    createGrille();
    setPositionsMur();
    setPositionsDepart();
    ecouterJoueur();
}

// On créer la grille de jeu
function createGrille() {
    
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
    document.getElementById(423).classList.add("currentPosition");
    document.getElementById(446).classList.add("currentPosition");

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
    console.log(grille);
}

function addNewPosition(la_case) {
    document.getElementById(la_case.val).classList.add("currentPosition");
}

// init un interval pour mouvement automatique 
let interval = 0;
// clean un interval
function stopInterval() {
    clearInterval(interval);
}

// Fonction permettant la prise en compte des actions du joueur (flèches directionnelles)
function mouvement(event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 83:
            stopInterval();
            interval = setInterval(function() {
                console.log("down");
                case_ = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                setCaseVisitee(case_);
                position_joueur.y++;
                new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                if (!gameOver(new_case)) addNewPosition(new_case);
            }, 200);
            break;
        case 90:
            stopInterval();
            interval = setInterval(function() {
                console.log("up");
                case_ = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                setCaseVisitee(case_);
                position_joueur.y--;
                new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                if (!gameOver(new_case)) addNewPosition(new_case);
            }, 200)
            break;
        case 81:
            stopInterval();
            interval = setInterval(function() {
                console.log("left");
                case_ = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                setCaseVisitee(case_);
                position_joueur.x--;
                new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                if (!gameOver(new_case)) addNewPosition(new_case);
            }, 200);
            break;
        case 68:
            stopInterval();
            interval = setInterval(function() {
                console.log("right");
                case_ = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                setCaseVisitee(case_);
                position_joueur.x++;
                new_case = grille.getCaseByCoord(position_joueur.x, position_joueur.y);
                if (!gameOver(new_case)) addNewPosition(new_case);
            } ,200);
            break;
    }
}

// Ajout de l'eventListener pour les flèches directionnelles
function ecouterJoueur() {
    window.addEventListener("keyup", mouvement);
}

// Permet de mettre la couleur "visitée" sur la case fournie en paramètre
function setCaseVisitee(caseVisite) {
   let td = document.getElementById(caseVisite.val);
   td.classList.remove("currentPosition");
   td.classList.add("caseVisite"); 
   td.setAttribute("style", "background-color:orange");
   grille.cases[caseVisite.val].isWall = true;
}


//si la nouvelle case est un mur, alors c'est perdu
function gameOver(lacase) {
    if (lacase.isWall) {
        window.removeEventListener("keyup", mouvement);
        alert("Fin");
        stopInterval();
    }
}