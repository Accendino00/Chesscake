var express = require('express');
var router = express.Router();
var path = require('path')
var config = require("../config")


class User {
    save (callback) {
        callback();
    }
}

/**
 * Gestione della richiesta "/register/newUser"
 * 
 * La richista sarà del tipo:
    POST /register/newUser HTTP/1.1
    User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)
    Host: www.chesscake.com
    Content-Type: json
    Content-Length: <lenght calcolata>
    
    {
        username: "admin",
        password: "prova"
    }
 * 
 */
router.post("/login", function (req, res) {
    // Cerchiamo nel req body se vi sono tutti i parametri non nulli, ovvero username e password
    if (req.body.username && req.body.password) {
        // Se sono presenti, li salviamo in due variabili
        var username = req.body.username;
        var password = req.body.password;
        // Creiamo un nuovo utente con i parametri appena ricevuti
        var newUser = new User({
            username: username,
            password: password
        });
        // Salviamo l'utente nel database
        newUser.save(function (err) {
            if (err) {
                // Se si è verificato un errore, lo stampiamo in console
                console.log(err);
                // e ritorniamo un errore 500
                res.status(500).send();
            } else {
                // Se non ci sono stati errori, ritorniamo un 200
                res.status(200).send();
            }
        });
    } else {
        // Se non sono presenti tutti i parametri, ritorniamo un errore 400
        res.status(400).send();
    }

});

module.exports = router;