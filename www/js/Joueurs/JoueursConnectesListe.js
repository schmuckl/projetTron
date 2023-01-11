// Contient la liste de tous les joueurs connectés dans des salles
class JoueursConnectesListe {
    constructor() {
        this.joueursConnectes = [];
    }

    ajouterJoueur(joueur) {
        this.joueursConnectes.push(joueur);
    }

    supprimerJoueur(joueur) {
        delete this.joueursConnectes[joueur];
    }

    isJoueurConnecte(pseudo) {
        let found = false;
        this.joueursConnectes.forEach(j => {
            if (j.pseudo == pseudo) found = true;
        });
        return found;
    }
}

module.exports = {
    JoueursConnectesListe: new JoueursConnectesListe()
}