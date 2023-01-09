const mongoose = require('mongoose');
// mongoose.connect(urlBdd + nomBdd);
mongoose.connect("mongodb://localhost:27017/" + "projetTron");

// const SalleSchema = {};

// const SalleBdd = mongoose.model('Joueur', SalleSchema);


module.exports = {
    Salle: class {
        constructor(id = 0, joueurs = [], nbJoueurs = 0) {
            this.id = id;
            this.joueurs = joueurs;
            this.nbJoueurs = nbJoueurs;
        }  

        getJoueurs() {
            return this.joueurs;
        }
        
        getNbJoueurs() {
            return this.nbJoueurs;
        }
        
        ajouterJoueur(joueur) {
            if (this.nbJoueurs < 2) {
                this.joueurs.push(joueur);
                this.nbJoueurs++;
            }
            //else ON NE PEUT PAS AJOUTER UN JOUEUR DE PLUS
        }

        supprimerJoueur(joueur) {
            delete this.joueurs[joueur]; 
            this.nbJoueurs--;
        }

        isSallePleine() {
            return this.nbJoueurs >= 2;
        }

        getId() {
            return this.id;
        }
    }
}