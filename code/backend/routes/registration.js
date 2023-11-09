var express = require('express');
var router = express.Router();
var path = require('path')
var config = require("../config")
var bcrypt = require('bcryptjs');


function registerUser(username, password) {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.hash(password, 8)
            .then((hashedPassword) => {
                const user = { username: username, password: hashedPassword };

                // Se ancora users non è stato inizializzato, lo inizializziamo
                if (config.users === undefined) {
                    config.users = [];
                }

                config.users.push(user);
                resolve({ message: "Utente registrato", status: 200, returnObject: { success: true }});
            }).catch((error) => {
                reject({ message: error, status: 500, returnObject: { success: false }});
            });
        } catch (error) {
            reject({ message: error, status: 500, returnObject: { success: false }});
        }
    });
}

/**
 * Gestione della richiesta "/register/newUser"
 * 
 * La richista sarà del tipo:
    POST /api/register HTTP/1.1
    User-Agent: Mozilla/4.0 (compatible; MSIE5.01; Windows NT)
    Host: www.chesscake.com
    Content-Type: application/json
    Content-Length: <lenght calcolata>
    
    {
        username: "admin",
        password: "prova"
    }
 * 
 */
router.post("/register", function (req, res) {
    // Cerchiamo nel req body se vi sono tutti i parametri non nulli, ovvero username e password
    if (req.body.username && req.body.password) {
        // Se sono presenti, li salviamo in due variabili
        var username = req.body.username;
        var password = req.body.password;
        // Creiamo un nuovo utente con i parametri appena ricevuti

        // Registriamo l'utente
        registerUser(username, password).then((result) => {
            // Se non ci sono stati errori, ritorniamo un 200
            res.status(200);

            // Ritorniamo un json con il token e un flag di successo
            // e impostiamo gli header in modo corretto
            res.body = {
                "success": true
            }

            res.header("Content-Type", "application/json");
            res.header("Content-Length", res.body.length);

            res.send(res.body);
        }).catch((error) => {
            // Se si è verificato un errore, lo stampiamo in console
            console.log(error.message);
            // e ritorniamo un errore 500
            res.status(error.status).send(error.returnObject);
        });;
    } else {
        // Se non sono presenti tutti i parametri, ritorniamo un errore 400
        res.status(400).send({ success: false });
    }

});

module.exports = router;