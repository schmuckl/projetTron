// Contient la liste de tous les joueurs connectés dans des salles
class JoueursConnectesListe {
    constructor() {
        this.joueursConnectes = [];
    }

    ajouterJoueur(joueur) {
        this.joueursConnectes[joueur.getPseudo()] = {joueur};
    }

    supprimerJoueur(joueur) {
        delete this.joueursConnectes[joueur.getPseudo()];
    }

    isJoueurConnecte(pseudo) {
        let found = false;
        Object.entries(this.joueursConnectes).forEach(([key, value]) => {
            if (value.joueur.getPseudo() == pseudo) found = true;
        });
        return found;
    }
}

module.exports = {
    JoueursConnectesListe: new JoueursConnectesListe()
}