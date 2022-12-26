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

    setWall() {
        this.isWall = true;
    }

    setDepart() {
        let td = document.getElementById(this.val);
        td.setAttribute("style", "background-color:red");
    }
}