class Case {
    constructor(val, pos_y, pos_x, isWall = false) {
        this.val = val;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.isWall = isWall;
    }

    // On créer la "case" dans la grille du jeu
    creerCase(value) {
        let table_grille = document.getElementById("grille");
        let td = table_grille.appendChild(document.createElement("td"));
        td.setAttribute("id", value);
    }

    setPositionJoueur(couleur_joueur) {
        this.isWall = true;
        let td = document.getElementById(this.val);
        td.setAttribute("style", "background-color:" + couleur_joueur);
    }

    setDepart(couleur) {
        let td = document.getElementById(this.val);
        td.style.backgroundColor = couleur;
    }

    getValeur() {
        return this.val;
    }
}