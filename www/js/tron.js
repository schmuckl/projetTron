
let grille = new Grille(tailleGrille);


function init() {
    // position_joueur_1 = position_joueur_depart_1;
    // position_joueur_2 = position_joueur_depart_2;
    // addNewPosition(cases[position_joueur.x][position_joueur.y]);
    createGrille();
    setPositionMur();
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
    document.getElementById(423).classList.add("currentPosition");
    document.getElementById(446).classList.add("currentPosition");

    console.log(grille.cases);
}

function setPositionMur(){

    for(let i =0 ;i<=870;i+=30){
        document.getElementById(i).classList.add("MurPosition");
    }
    for(let i =29 ;i<=899;i+=30){
        document.getElementById(i).classList.add("MurPosition");
    }
    for(let i =1 ;i<29;i++){
        document.getElementById(i).classList.add("MurPosition");
    }
    for(let i =871 ;i<899;i++){
        document.getElementById(i).classList.add("MurPosition");
    }

   
}

function addNewPosition(la_case) {
    document.getElementById(la_case).classList.add("currentPosition");
}

// entrz le coordonner et return sa valuer de case
function getValeur(x,y){
    let a=0
    grille.cases.forEach(case_ => {
        if(case_.pos_x == x && case_.pos_y == y) {
            a = case_.val;
        }
    });
    return a;
}

// init un interval pour mouvement automatique 
let myVar = 0
// clean un interval
function stopInterval() {
    clearInterval(myVar);
}

// Fonction permettant la prise en compte des actions du joueur (flèches directionnelles)
function mouvement(event) {
    let a = 0
    let b = 0
    event.preventDefault();
    switch (event.keyCode) {
        case 83:
            stopInterval()
            myVar =  setInterval(function(){
                console.log("down")
                a = getValeur(position_joueur.x,position_joueur.y)
                setCaseVisitee(a);
                position_joueur.y++;
                b = getValeur(position_joueur.x,position_joueur.y)
                addNewPosition(b);
                gameOver(b);
            },200)
            break;
        case 90:
            stopInterval()
            myVar = setInterval(function(){
                console.log("up")
                a = getValeur(position_joueur.x,position_joueur.y)
                setCaseVisitee(a);
                position_joueur.y--;
                b = getValeur(position_joueur.x,position_joueur.y)
                addNewPosition(b);
                gameOver(b);
            },200)
            break;
        case 81:
            stopInterval()
            myVar = setInterval(function(){
                console.log("left")
                a = getValeur(position_joueur.x,position_joueur.y)
                setCaseVisitee(a);
                position_joueur.x--;
                b = getValeur(position_joueur.x,position_joueur.y)
                addNewPosition(b);
                gameOver(b);
            },200)
            break;
        case 68:
            stopInterval()
            myVar = setInterval(function(){
                console.log("right")
                a = getValeur(position_joueur.x,position_joueur.y)
                setCaseVisitee(a);
                position_joueur.x++;
                b = getValeur(position_joueur.x,position_joueur.y)
                addNewPosition(b);
                gameOver(b);
            },200)
            break;
    }
}

// Ajout de l'eventListener pour les flèches directionnelles
function ecouterJoueur() {
    window.addEventListener("keyup", mouvement);
}

// Permet de mettre la couleur "visitée" sur la case fournie en paramètre
function setCaseVisitee(caseVisite) {
   let td = document.getElementById(caseVisite);
   td.classList.remove("currentPosition");
   td.classList.add("caseVisite"); 
   td.setAttribute("style", "background-color:orange");
}


//si le case qui a le class currentPosition et caseVisite. il a predu
function gameOver(caseHead){
    let td = document.getElementById(caseHead);
    if(td.classList.length>=2){
        alert("lose")
    }
}