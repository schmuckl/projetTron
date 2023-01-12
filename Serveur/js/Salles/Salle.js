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

        getInfosJoueurs() {
            // Array des infos des joueurs sans la connexion
            let infosJoueurs = [];
            this.joueurs.forEach(j => {
                infosJoueurs.push({
                    "pseudo" : j.pseudo,
                    "password" : j.password,
                    "score" : j.score
                });
            });
            return infosJoueurs;
        }

        getPseudosJoueurs() {
            let pseudos = [];
            this.joueurs.forEach(j => {
                pseudos.push(j.getPseudo());
            });
            return pseudos;
        }
        
        getNbJoueurs() {
            return this.nbJoueurs;
        }
        
        ajouterJoueur(joueur) {
            if (this.nbJoueurs < 2) {
                this.joueurs.push(joueur);
                this.nbJoueurs++;
            }
        }

        supprimerJoueur(joueur) {
            let index = this.joueurs.indexOf(joueur);
            delete this.joueurs.splice(index, 1);
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