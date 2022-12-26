
let grille = new Grille(tailleGrille);

function init() {
    // position_joueur_1 = position_joueur_depart_1;
    // position_joueur_2 = position_joueur_depart_2;
    // addNewPosition(cases[position_joueur.x][position_joueur.y]);
    createGrille();
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
    grille.cases = cases;
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

function addNewPosition(la_case) {
    document.getElementById(la_case.getValeur()).classList.add("current-position");
}

// Fonction permettant la prise en compte des actions du joueur (flèches directionnelles)
function mouvement(event) {
    event.preventDefault();
    switch (event.key) {
        case "ArrowDown":
            setCaseVisitee(cases[position_joueur.x][position_joueur.y]);
            position_joueur.x++;
            addNewPosition(cases[position_joueur.x][position_joueur.y]);
            break;
        case "ArrowUp":
            setCaseVisitee(cases[position_joueur.x][position_joueur.y]);
            position_joueur.x--;
            addNewPosition(cases[position_joueur.x][position_joueur.y]);
            break;
        case "ArrowLeft":
            setCaseVisitee(cases[position_joueur.x][position_joueur.y]);
            position_joueur.y--;
            addNewPosition(cases[position_joueur.x][position_joueur.y]);
            break;
        case "ArrowRight":
            setCaseVisitee(cases[position_joueur.x][position_joueur.y]);
            position_joueur.y++;
            addNewPosition(cases[position_joueur.x][position_joueur.y]);
            break;
    }

    // if (success()) {
    //     alert("Félicitations ! Vous avez trouvé la sortie !");
    //     window.removeEventListener("keyup", mouvement);
    // }
}

// Ajout de l'eventListener pour les flèches directionnelles
function ecouterJoueur() {
    window.addEventListener("keyup", mouvement);
}

// Permet de mettre la couleur "visitée" sur la case fournie en paramètre
function setCaseVisitee(case_visitee) {
    afficherCasesVisitees(case_visitee);
    case_visitee.setVisited(true);
}