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
            Object.entries(this.joueurs).forEach(([key, value]) => {
                infosJoueurs.push({
                    "pseudo" : value.joueur.getPseudo(),
                    "score" : value.joueur.getScore()
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
                this.joueurs[joueur.getPseudo()] = {joueur};
                this.nbJoueurs++;
            }
        }

        supprimerJoueur(joueur) {
            this.joueurs.splice(joueur.getPseudo(), 1);
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