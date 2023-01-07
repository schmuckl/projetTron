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
        return this.joueursConnectes.includes(pseudo);
    }
}

module.exports = {
    JoueursConnectesListe: new JoueursConnectesListe()
}