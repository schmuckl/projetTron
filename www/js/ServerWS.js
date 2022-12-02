const http = require('http');
const server = http.createServer();
server.listen(9898); 

// Création du server WebSocket qui utilise le serveur précédent
const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
httpServer: server
});

let sockets = [];
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    // Ecrire ici le code qui indique ce que l'on fait en cas de
// réception de message et en cas de fermeture de la WebSocket
    sockets.push(connection);

    connection.on('message', function(message) {
        console.log("Serveur je reçois : "+message.utf8Data);
        connection.send("J'ai bien reçu au niveau du serveur !");
    });

    connection.on('close', function(reasonCode, description) {
        console.log(reasonCode+". Tu as fermé la websocket :( "+description);
        sockets = sockets.filter(s => s !== connection);
    });

    connection.on('error', function () {
        console.log("Some Error occurred");
    });

});
console.log("The WebSocket server is running on port 9898");