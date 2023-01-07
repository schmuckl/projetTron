const mongoose = require('mongoose');
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

		saveJoueurBdd() {
			const nouveauJoueur = new JoueurBdd({pseudo : this.pseudo, password: this.password, score: this.score});
			nouveauJoueur.save();
		}

		findJoueurBdd() {
			let bool = false;

			JoueurBdd.findOne({name : this.pseudo, password: this.password}).exec((err, joueur)=> {
				// Dans le cas où une erreur serait rencontrée lors du findOne
				if (err) {
					console.log(err);
				}
				if (joueur != null) {
					bool = true;
				}
			});
			
			return bool;
		}
	}
}






/* var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// Récupère tous les éléments présents dans la collection Joueurs
MongoClient.connect(url, function (err, db) {
	if (err) throw err;
	var dbo = db.db("projetTron");
	dbo.collection("Joueurs").find({}).toArray(function (err, result) {
		if (err) throw err;
		console.log(result);
		db.close();
	});
}); */