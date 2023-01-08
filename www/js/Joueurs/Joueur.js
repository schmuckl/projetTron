const mongoose = require('mongoose');
const JoueursConnectesListe = require('./JoueursConnectesListe');
// mongoose.connect(urlBdd + nomBdd);
mongoose.connect("mongodb://localhost:27017/" + "projetTron");

const joueurSchema = {
    pseudo : {
        type : String
    },
    password : {
        type : String
    },
    score : {
        type : Number
    }
};

// const JoueurBdd = mongoose.model('Joueur', joueurSchema);
const JoueurBdd = mongoose.model('joueurs', joueurSchema);

module.exports = {
	Joueur: class {
		constructor(pseudo, password = null, score = null) {
			this.pseudo = pseudo;
			this.password = password;
			this.score = score;
		}

		async findJoueurBdd() {

			let messageJson = {
				type : "connexion",
				statut : false,
				message : "",
				pseudo : ""
			}

			 // Retourne une promesse qui sera résolue on aura trouvé ou non le joueur
			 await new Promise((resolveConnection) => {
				// Cherche le joueur via son pseudo et son password
				JoueurBdd.findOne({pseudo: this.pseudo, password: this.password}).exec(async (err, joueur)=> {
					if (err) {
						resolveConnection(messageJson);
					}
					// Si un joueur a été trouvé
					if (joueur != null) {
						messageJson.message = "Connexion OK";
						messageJson.statut = true;
					} else {
						await new Promise((resolveCreation) => {
							const nouveauJoueur = new JoueurBdd({pseudo : this.pseudo, password: this.password, score: this.score});
							nouveauJoueur.save();
							resolveCreation();
						})
						messageJson.message = "Votre compte a été créé.";
						messageJson.statut = true;
					}
					resolveConnection(messageJson);
				});
			});
			
			return messageJson;
		}
	}
}