const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/projetTron');

const playerSchema = {pseudo : String, password : String, color : String};

const Player = mongoose.model('Player', playerSchema);

const player1 = new Player({pseudo : "jonny", password : "jonny", color : "bleue"});
const player2 = new Player({pseudo : "cash", password : "cash", color : "rouge"});
const player3 = new Player({pseudo : "test", password : "test", color : "vert"});
const player4 = new Player({pseudo : "hihelo", password : "hihelo", color : "gris"});
const player5 = new Player({pseudo : "sirene", password : "sirene", color : "orange"});
const player6 = new Player({pseudo : "tenta", password : "tenta", color : "jaune"});
const player7 = new Player({pseudo : "luffy", password : "luffy", color : "vioconst"});

player1.save();
player2.save();
player3.save();
player4.save();
player5.save();
player6.save();
player7.save();