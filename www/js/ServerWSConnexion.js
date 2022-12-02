// Création server http  que l'on va utiliser pour créer le serveur qui va écouter un port 9898, où les demandes des clients se fera à partir d'une websocket
const http = require('http');
const server = http.createServer();
server.listen(9898); 

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
httpServer: server
});

// Ce serveur et les websockets chez les clients permet en queqlue sort de créer un tunnel de communications pour que certaines actions puissent être faites en fonction de ce que l'on veut.

let sockets = [];
// Pour chaque requête qu'on reçoit (pour chaque client - chaque websocket créée
)
wsServer.on('request', function(request) {
    // On accepte toutes les websockets. 
    const connection = request.accept(null, request.origin);
    
    sockets.push(connection);

    // Quand le serveur reçoit un message on va regarder ce qu'il y a à l'intérieur pour avoir les identifiants et mot de passe du client.
    connection.on('message', function(message) {
        console.log(message.utf8Data); // ça écrit le message dans la console du serveur.
        let messageJSON = JSON.parse(message.utf8Data); // on prend le message qui est un string et vu que nous avons envoyé un objet json nous utilisons la méthode parse pour qu'il passe de string --> objet js
        
        // on prépare le message si au cas où ce ne sont pas les bons identifiants ou mot de passes
        let reponseClient = {
            status : "failed",
            type : "connexion"
        } 
        console.log(messageJSON);

        // on regarde si l'identifiant et le mot de passe sont correctes 
        if(messageJSON.identifiant == "ok" && messageJSON.motDePasse == "ok"){
            // si oui on change le status pour dire que la connexion est un succès 
            reponseClient.status = "success";
        }
        //on renvoit cette information au client avec la websocket
        connection.send(JSON.stringify(reponseClient));
      
    });

    // Quand la websocket se ferme, l'utilisateur ferme son onglet ou navigateur ou par un timer qu'on a mis (pas notre cas ici)
    connection.on('close', function(reasonCode, description) {
        // on affiche dans la console du serveur que la websocket est fermé 
        console.log(reasonCode+". Tu as fermé la websocket :( "+description);
        sockets = sockets.filter(s => s !== connection);
    });

    connection.on('error', function () {
        console.log("Some Error occurred");
    });

});

// On affiche quand le serveur s'allume ce message pour savoir s'
console.log("The WebSocket server is running on port 9898");