class Grille {
    constructor(taille, cases = null) {
        this.taille = taille;
        this.cases = cases;
    }

    getCases() {
        return this.cases;
    }

    setCases(cases) {
        this.cases = cases;
    }

    getCaseByCoord(x, y) {
        let lacase = null;
        this.cases.forEach(case_ => {
            if(case_.pos_x == x && case_.pos_y == y) {
                lacase = case_;
            }
        });
        return lacase;
    }
}