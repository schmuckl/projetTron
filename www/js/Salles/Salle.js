const mongoose = require('mongoose');
// mongoose.connect(urlBdd + nomBdd);
mongoose.connect("mongodb://localhost:27017/" + "projetTron");

// const SalleSchema = {};

// const SalleBdd = mongoose.model('Joueur', SalleSchema);


module.exports = {
    Salle: class {
        constructor() {
            this.id = null;
            this.joueurs = []; 
            this.nbJoueurs = 0;
        }  

        getJoueurs() {
            return this.joueurs;
        }
        
        getNbJoueurs() {
            return this.nbJoueurs;
        }
        
        ajouterJoueur(joueur) {
            if (this.joueurs.length <= 2) {
                this.joueurs.push(joueur);
                this.nbJoueurs++;
            }
            //else ON NE PEUT PAS AJOUTER UN JOUEUR DE PLUS
        } 

        supprimerJoueur(joueur) {
            delete this.joueurs[joueur]; 
            this.nbJoueurs--;
        }

        isSallePleine(salle) {
            return salle.nbJoueurs <= 2;
        }
    }
}