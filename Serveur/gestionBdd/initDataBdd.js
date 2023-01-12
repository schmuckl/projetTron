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