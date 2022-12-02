const ws = new WebSocket('ws://localhost:9898/');

ws.onopen = function() {
   console.log("sur mon pc la websocket est bien ouverte !")
};
ws.onmessage = function(e) {
   console.log("j'ai reçu : " + e.data)
};
ws.envoyermessage = function(message){
    console.log("je t'envoie ce message :" + message)
    ws.send(message)
};