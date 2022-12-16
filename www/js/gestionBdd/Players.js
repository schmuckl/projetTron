var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// Récupère tous les éléments présents dans la collection players
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("projetTron");
  dbo.collection("players").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
}); 