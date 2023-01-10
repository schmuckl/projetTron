const {Salle} = require("./Salle");
const {JoueursConnectesListe} = require("../Joueurs/JoueursConnectesListe");

class SallesController {
    constructor() {
        this.salles = []; 
    } 

    getNbSalles() {
        return this.salles.length;
    }

    creerSalle(joueur) {
        let idSalle = this.getNbSalles() + 1;
        let salle = new Salle(idSalle);
        salle.ajouterJoueur(joueur);
        JoueursConnectesListe.ajouterJoueur(joueur);
        this.salles.push(salle);
        return salle;
    }

    // Ajoute un joueur à une salle d'attente existante s'il y en a, sinon on créer une autre salle
    ajouterJoueurDansSalle(joueur) {
        let joueurAjoute = false;
        let salle = null;

        this.salles.forEach(s => {
            if (!s.isSallePleine()) {
                s.ajouterJoueur(joueur);
                joueurAjoute = true;
                salle = s;
                return;
            }
        });
        if (!joueurAjoute) {
            // On créer une nouvelle salle vu que toutes les autres sont pleines
            salle = this.creerSalle(joueur);
            joueurAjoute = true;
        }
        return salle;
    }

    // Récupère l'élément Salle dans lequel se trouve un joueur par son pseudo
    getSalleByJoueurPseudo(pseudo) {
        let salle = null;
        this.salles.forEach(s => {
            console.log(s);
            s.getJoueurs().forEach(j => {
                if (j.pseudo == pseudo) {
                    salle = s;
                    return;
                }
            });
        });
        console.log(salle);
        return salle;
    }
} 

module.exports = {
    SallesController: new SallesController()
}