// Permet de créer une websocket qui va envoyer toutes les requêtes à cette url et ce port (que le serveur écoute)
const ws = new WebSocket('ws://localhost:9898/');
// const ws = new WebSocket('ws://130.190.75.86:9898/');

// Quand la websocket reçoit un message de la part du serveur
ws.onmessage = function(e) {

    console.log(e);

    
    if (e.data == "Il y a 2 joueurs, on peut lancer la partie. - nbJoueurs : 2") {
        window.location.href = "/tron.html";
    }else{
        console.log("wait")
    }


    let reponseJSON  = JSON.parse(e.data); // on prend le message qui est un string et vu que nous avons envoyé un objet json nous utilisons la méthode parse pour qu'il passe de string --> objet js
    //Nous regardons quel message nous recvons car nous pouvons avoir plusieurs types 
    // Ici nous regardons seulement pour les messages de type connexion (définit par nous même sur le fichier js serveurConnexion)
    if(reponseJSON.type == "connexion"){
        if(reponseJSON.status == "success" ){
            // On affiche dans le navigateur client qu'il est bien connecté
            alert("Vous êtes connecté.e !!");
        }
        if(reponseJSON.status == "failed" ){
            // On affiche dans le navigateur client que ce ne sont pas le identifiant ou mot de passe
            alert("On ne vous connait pas oust ...");
        }
    }
    

   
};

// Quand le client appuie sur le bouton se connecter (dans connexion.html)
ws.meConnecter = function(){
    // on récupère l'identifiant depuis le DOM du html (on peut sûrement le faire de manière plus propre)
    let id = document.getElementById("identifiant").value;
    let mdp = document.getElementById("motDePasse").value;
    //On regarde si l'identifiant ou le mot de passe est vide 
    if(!id.replace(" ", "") || !mdp.replace(" ","")){
        // si c'est le cas, un des deux est vide ou les deux on demande au client de re rentrer ces informations, et on n'envoit aucun message au serveur pour éviter de faire une action inutile
        alert("Il faut écrire quelque chose dans les deux champs ...");
    }
    else{
        // et si les deux ne sont pas vides alors on envoit au client avec un objet json string, l'identifiant rentré et le mot de passe
        const utilisateurConnexion = {
            identifiant : id,
            motDePasse : mdp
        };
        ws.send(JSON.stringify(utilisateurConnexion));
    }
};