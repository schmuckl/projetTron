const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/projetTron');

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

const Joueur = mongoose.model('joueurs', joueurSchema);

const joueur1 = new Joueur({pseudo : "jonny", password : "jonny", score : 0});
const joueur2 = new Joueur({pseudo : "cash", password : "cash", score : 0});
const joueur3 = new Joueur({pseudo : "test", password : "test", score : 0});
const joueur4 = new Joueur({pseudo : "hihelo", password : "hihelo", score : 0});

joueur1.save();
joueur2.save();
joueur3.save();
joueur4.save();